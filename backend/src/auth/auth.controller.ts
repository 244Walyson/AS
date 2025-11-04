import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from 'src/shared/decorators/public.decorator';
import { AccessTokenDto } from './dto/access-token.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { OauthCredentialsDto } from './dto/oauth-credentials.dto';
import { RefreshCredentialsDto } from './dto/refresh-credentials.dto';
import { GoogleOauthService } from './services/google-oauth.service';
import { LocalAuthService } from './services/local-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: LocalAuthService,
    private readonly googleOauthService: GoogleOauthService,
  ) {}

  @Post('token')
  @Public()
  async getAccessToken(
    @Body() credentials: CredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessTokenDto: AccessTokenDto =
      await this.authService.generateAccessToken(credentials);

    const refreshToken = accessTokenDto.refresh_token;
    if (refreshToken) {
      this.assignRefreshTokenOnCookie(refreshToken, res);
    }
    delete accessTokenDto.refresh_token;

    return accessTokenDto;
  }

  @Post('token/refresh')
  @Public()
  async refreshAccessToken(
    @Body() credentials: RefreshCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessTokenDto: AccessTokenDto =
      await this.authService.refreshAccessToken(credentials);

    const refreshToken = accessTokenDto.refresh_token;

    if (refreshToken) {
      this.assignRefreshTokenOnCookie(refreshToken, res);
      delete accessTokenDto.refresh_token;
    }

    return accessTokenDto;
  }

  @Post('google')
  @Public()
  async googleAuth(
    @Body() credentials: OauthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessTokenDto: AccessTokenDto =
      await this.googleOauthService.googleAuth(credentials);

    const refreshToken = accessTokenDto.refresh_token;

    if (refreshToken) {
      this.assignRefreshTokenOnCookie(refreshToken, res);
      delete accessTokenDto.refresh_token;
    }

    return accessTokenDto;
  }

  assignRefreshTokenOnCookie(refreshToken: string, res: Response) {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: sevenDaysInMs,
    });
  }
}