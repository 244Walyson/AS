import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialComment } from '../entities/social-comment.entity';
import { SocialPost } from '../entities/social-post.entity';
import { SocialToken } from '../entities/social-token.entity';
import { InstagramController } from './controllers/instagram.controller';
import { InstagramService } from './services/instagram.service';
import { OAuthService } from './services/oauth.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    HttpModule,
    S3Module,
    TypeOrmModule.forFeature([SocialToken, SocialPost, SocialComment]),
  ],
  controllers: [InstagramController],
  providers: [OAuthService, InstagramService],
})
export class InstagramModule {}
