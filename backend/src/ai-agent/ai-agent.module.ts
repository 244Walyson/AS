import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialComment } from 'src/social-media/entities/social-comment.entity';
import { User } from 'src/user/entities/user.entity';
import { AiAgentController } from './controllers/ai-agent.controller';
import { CommentEntity } from './entities/comment-entities.entity';
import { CommentHashtag } from './entities/comment-hashtag.entity';
import { CommentSentiment } from './entities/comment-sentiments.entity';
import { AiAgentService } from './services/ai-agent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SocialComment,
      CommentSentiment,
      CommentEntity,
      CommentHashtag,
    ]),
  ],
  controllers: [AiAgentController],
  providers: [AiAgentService],
})
export class AiAgentModule {}
