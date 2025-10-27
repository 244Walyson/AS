import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialComment } from 'src/social-media/entities/social-comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment-entities.entity';
import { CommentHashtag } from '../entities/comment-hashtag.entity';
import { CommentSentiment } from '../entities/comment-sentiments.entity';
import { initializeLangGraph } from './agents/graph';
@Injectable()
export class AiAgentService {
  private graph;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CommentSentiment)
    private readonly commentSentimentRepository: Repository<CommentSentiment>,
    @InjectRepository(SocialComment)
    private readonly socialCommentRepository: Repository<SocialComment>,
  ) {
    this.graph = initializeLangGraph();
  }

  async analyzeText(text: string, lang: string = 'pt') {
    const result = await this.graph.invoke({ text, lang });
    return result;
  }

  async requestAnalysis({
    userId,
    commentId,
    lang = 'pt',
  }: {
    userId: string;
    commentId?: string;
    lang?: string;
  }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comments = await this.socialCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.sentiment', 'sentiment')
      .innerJoin('comment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId: user.id })
      .andWhere('sentiment.id IS NULL')
      .getMany();

    for (const comment of comments) {
      const analysisResult = await this.analyzeText(comment.text, lang);
      const analysis = analysisResult.analysis;

      const sentiment = this.commentSentimentRepository.create({
        sentiment: analysis.sentiment,
        intensity: analysis.intensity,
        emotion: analysis.emotion,
        sentimentValue: analysis.sentiment_value,
        motivation: analysis.motivation,
        interactionType: analysis.interaction_type,
        impact: analysis.impact,
        feedback: analysis.feedback,
        entities: analysis.entities.map(
          (e) => ({ entityName: e }) as CommentEntity,
        ),
        hashtags: analysis.hashtags.map(
          (h) => ({ hashtag: h }) as CommentHashtag,
        ),
        tone: analysis.context?.tone,
        sarcasm: analysis.context?.sarcasm,
        comment: comment,
      });
      await this.commentSentimentRepository.save(sentiment);
    }
  }
}
