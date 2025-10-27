import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentSentiment } from 'src/ai-agent/entities/comment-sentiments.entity';
import { SocialPost } from 'src/social-media/entities/social-post.entity';
import { SentimentsController } from './controllers/sentiments.controller';
import { SentimentsService } from './services/sentiments.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentSentiment, SocialPost])],
  controllers: [SentimentsController],
  providers: [SentimentsService],
})
export class SentimentsModule {}
