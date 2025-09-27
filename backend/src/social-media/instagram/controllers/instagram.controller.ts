import { Body, Controller, Post, Request } from '@nestjs/common';
import { OAuthService } from '../services/oauth.service';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly oauthService: OAuthService) {}

  @Post('credentials')
  async saveCredentials(
    @Request() req: Request & { user: { sub: string } },
    @Body() { authorization_code }: { authorization_code: string },
  ) {
    const userId = req.user.sub;
    return this.oauthService.saveInstagramCredentials({
      code: authorization_code,
      userId,
    });
  }
}
