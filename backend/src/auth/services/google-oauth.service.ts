import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';
import { AccessTokenDto } from '../dto/access-token.dto';
import { OauthCredentialsDto } from '../dto/oauth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthProviderEnum } from '../dto/credentials.dto';
import fetch from 'node-fetch';

@Injectable()
export class GoogleOauthService {
  private readonly logger = new Logger(GoogleOauthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: LocalAuthService,
  ) {}

  async googleAuth(credentials: OauthCredentialsDto): Promise<AccessTokenDto> {
    this.logger.log('Iniciando autenticação via Google OAuth');

    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credentials.authorization_code}` },
      });
      if (!res.ok) {
        throw new UnauthorizedException('Token do Google inválido');
      }

      const payload = (await res.json()) as {
        sub: string;
        email?: string;
        given_name?: string;
        family_name?: string;
        name?: string;
        picture?: string;
        email_verified?: boolean;
      };

      if (!payload.email) {
        throw new UnauthorizedException('Resposta do Google não contém email');
      }

      const { email, given_name, family_name, name } = payload;

      let user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        user = this.userRepository.create({
          name: name || `${given_name ?? ''} ${family_name ?? ''}`.trim(),
          email,
          picture: payload.picture,
          username: given_name.concat(payload.sub.substring(0, 4)),
          isVerified: payload.email_verified || false,
        });
        await this.userRepository.save(user);
      }

      // Gera access token interno
      return this.authService.generateAccessToken({
        username: user.username,
        provider: AuthProviderEnum.OAUTH,
      });
    } catch (err) {
      this.logger.error('Erro ao autenticar via Google OAuth', err);
      throw new UnauthorizedException('Falha na autenticação Google');
    }
  }
}
