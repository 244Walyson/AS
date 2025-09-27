import { Module } from '@nestjs/common';
import { InstagramModule } from './instagram/instagram.module';

@Module({
  imports: [InstagramModule],
})
export class SocialMediaModule {}
