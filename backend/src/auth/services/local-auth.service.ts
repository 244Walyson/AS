import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthProviderEnum, CredentialsDto } from '../dto/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from '../dto/access-token.dto';
import * as bcrypt from 'bcryptjs';
import { Token, TokenType } from 'src/user/entities/token.entity';
import * as crypto from 'crypto';
import { RefreshCredentialsDto } from '../dto/refresh-credentials.dto';

@Injectable()
export class LocalAuthService {
  private readonly logger = new Logger(LocalAuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}
  async generateAccessToken(dto: CredentialsDto): Promise<AccessTokenDto> {
    const { username, password, provider } = dto;
    const user = await this.userRepository.findOne({
      where: [{ email: username }, { username: username }],
    });

    if (!user) {
      Logger.error(`User not found with login ${dto.username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!provider || provider === AuthProviderEnum.LOCAL) {
      if (!password || !user.password) {
        Logger.error(`Password not provided for user ${dto.username}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        Logger.error(`Invalid password for user ${dto.username}`);
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });
    const refreshtoken = await this.generateRefreshToken(user);

    return new AccessTokenDto({
      access_token: accessToken,
      type: 'bearer',
      expires_in: process.env.JWT_EXPIRATION_TIME || '3600',
      refresh_token: refreshtoken,
    });
  }

  async refreshAccessToken(
    refreshAccessToken: RefreshCredentialsDto,
  ): Promise<AccessTokenDto> {
    const user = await this.validateRefreshToken({
      refreshToken: refreshAccessToken.refresh_token,
    });
    return this.generateAccessToken({
      username: user.username,
      provider: AuthProviderEnum.REFRESH,
    });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const refreshtoken = new Token({
      token,
      tokenType: TokenType.REFRESH,
      expiresAt: tokenExpiration,
      user: user,
    });
    await this.tokenRepository.save(refreshtoken);
    return refreshtoken.token;
  }

  private async validateRefreshToken({
    refreshToken,
  }: {
    refreshToken: string;
  }) {
    const token = await this.tokenRepository.findOne({
      where: { token: refreshToken, tokenType: TokenType.REFRESH },
      relations: ['user'],
    });
    if (!token) {
      Logger.error(`Refresh token not found: ${refreshToken}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (token.isRevoked) {
      const allTokens = await this.tokenRepository.find({
        where: { user: { id: token.user.id }, tokenType: TokenType.REFRESH },
      });
      for (const t of allTokens) {
        t.isRevoked = true;
        await this.tokenRepository.save(t);
      }
      Logger.error(`Refresh token is revoked: ${refreshToken}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (token.expiresAt && new Date() > token.expiresAt) {
      Logger.error(`Refresh token is expired: ${refreshToken}`);
      throw new UnauthorizedException('Refresh token expired');
    }
    token.isRevoked = true;
    await this.tokenRepository.save(token);
    return token.user;
  }
}
