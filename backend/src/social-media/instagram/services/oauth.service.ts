import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialToken } from 'src/social-media/entities/social-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OAuthService {
  private readonly instagramClientId: string;
  private readonly instagramClientSecret: string;
  private readonly redirectUri: string;
  private readonly instagramAuthUrl: string;
  private readonly instagramGraphUrl: string;
  constructor(
    @InjectRepository(SocialToken)
    private readonly socialTokenRepository: Repository<SocialToken>,
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    this.instagramClientId = this.config.get<string>('INSTAGRAM_CLIENT_ID');
    this.instagramClientSecret = this.config.get<string>(
      'INSTAGRAM_CLIENT_SECRET',
    );
    this.redirectUri = this.config.get<string>('INSTAGRAM_REDIRECT_URI');
    this.instagramAuthUrl = this.config.get<string>('INSTAGRAM_AUTH_URL');
    this.instagramGraphUrl = this.config.get<string>('INSTAGRAM_GRAPH_URL');
  }

  async saveInstagramCredentials({
    code,
    userId,
  }: {
    code: string;
    userId: string;
  }) {
    const accessTokenData = await this.getAccessToken(code);
    const longLivedTokenData = await this.getLongLivedToken(
      accessTokenData.access_token,
    );

    const socialToken = this.socialTokenRepository.create({
      userId,
      userSocialId: accessTokenData.user_id,
      provider: 'instagram',
      accessToken: longLivedTokenData.access_token,
      expiresAt: new Date(Date.now() + longLivedTokenData.expires_in * 1000),
    });

    await this.socialTokenRepository.save(socialToken);

    return { message: 'Instagram credentials saved successfully' };
  }

  async getAccessToken(code: string) {
    const body = new URLSearchParams({
      client_id: this.instagramClientId,
      client_secret: this.instagramClientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
      code,
    });

    const response = await this.http.axiosRef.post(
      `${this.instagramAuthUrl}oauth/access_token`,
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return response.data;
  }

  async getLongLivedToken(shortLivedToken: string) {
    const response = await this.http.axiosRef.get(
      `${this.instagramGraphUrl}access_token`,
      {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: this.instagramClientSecret,
          access_token: shortLivedToken,
        },
      },
    );

    return response.data;
  }
}
