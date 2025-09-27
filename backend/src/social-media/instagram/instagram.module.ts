import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialToken } from '../entities/social-token.entity';
import { InstagramController } from './controllers/instagram.controller';
import { OAuthService } from './services/oauth.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([SocialToken])],
  controllers: [InstagramController],
  providers: [OAuthService],
})
export class InstagramModule {}
