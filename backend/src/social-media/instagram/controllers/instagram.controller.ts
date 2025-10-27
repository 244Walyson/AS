import { Body, Controller, Post, Request } from '@nestjs/common';
import { InstagramService } from '../services/instagram.service';
import { OAuthService } from '../services/oauth.service';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly oauthService: OAuthService, private readonly instagramService: InstagramService) {}

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

  @Post('sync-posts')
  async syncPosts(@Request() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.instagramService.syncPosts(userId);
  }

  @Post('sync-comments')
  async syncComments(@Request() req: Request & { user: { sub: string } }, @Body() { postId }: { postId: string }) {
    const userId = req.user.sub;
    return this.instagramService.syncComments(postId, userId);
  }
}
