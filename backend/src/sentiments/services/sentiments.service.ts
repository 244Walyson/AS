import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationType } from 'src/@types/pagination.type';
import { CommentSentiment } from 'src/ai-agent/entities/comment-sentiments.entity';
import { SocialPost } from 'src/social-media/entities/social-post.entity';
import { Repository } from 'typeorm';
import { SentimentTrendDto } from '../dto/sentiment-trend.dto';

@Injectable()
export class SentimentsService {
  constructor(
    @InjectRepository(CommentSentiment)
    private readonly commentSentimentRepository: Repository<CommentSentiment>,
    @InjectRepository(SocialPost)
    private readonly socialPostRepository: Repository<SocialPost>,
  ) {}

  async findAllSentiments({
    userId,
  }: {
    userId: string;
  }): Promise<CommentSentiment[]> {
    return this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .getMany();
  }

  async findAllPosts({
    userId,
    page = 1,
    size = 10,
  }: {
    userId: string;
    page: number;
    size: number;
  }): Promise<PaginationType<SocialPost>> {
    const [posts, totalItems] = await this.socialPostRepository.findAndCount({
      where: { user: { id: userId } },
      skip: (page - 1) * size,
      take: size,
    });

    for (const post of posts) {
      const sentimentsStats = await this.commentSentimentRepository
        .createQueryBuilder('sentiment')
        .select('sentiment.sentiment', 'sentiment')
        .addSelect('COUNT(sentiment.id)', 'count')
        .addSelect(
          'ROUND((COUNT(sentiment.id) * 100.0 / SUM(COUNT(sentiment.id)) OVER ()), 2)',
          'percentage',
        )
        .innerJoin('sentiment.comment', 'SocialComment')
        .innerJoin('SocialComment.post', 'SocialPost')
        .where('SocialPost.id = :postId', { postId: post.id })
        .groupBy('sentiment.sentiment')
        .getRawMany();
      post['sentimentsStats'] = sentimentsStats;
    }

    return {
      content: posts,
      page,
      size,
      totalItems,
      totalPages: Math.ceil(totalItems / size),
      isFirstPage: page === 1,
      isLastPage: page === Math.ceil(totalItems / size),
    };
  }

  async getDashboardOverview({ userId }: { userId: string }) {
    const totalPosts = await this.socialPostRepository.count({
      where: { user: { id: userId } },
    });

    const totalComments = await this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .getCount();

    const sentimentDistribution = await this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .select('sentiment.sentiment', 'sentiment')
      .addSelect('COUNT(sentiment.id)', 'count')
      .addSelect(
        'ROUND((COUNT(sentiment.id) * 100.0 / SUM(COUNT(sentiment.id)) OVER ()), 2)',
        'percentage',
      )
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .groupBy('sentiment.sentiment')
      .getRawMany();

    const avgSentiment = await this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .select('AVG(sentiment.sentiment_value)', 'average')
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .andWhere('sentiment.sentiment_value IS NOT NULL')
      .getRawOne();

    return {
      totalPosts,
      totalComments,
      sentimentDistribution,
      averageSentimentValue: avgSentiment?.average
        ? parseFloat(avgSentiment.average).toFixed(2)
        : null,
    };
  }

  async getSentimentsTrend({
    userId,
    days = 30,
  }: {
    userId: string;
    days?: number;
  }) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .select('DATE(sentiment.created_at)', 'date')
      .addSelect('sentiment.sentiment', 'sentiment')
      .addSelect('COUNT(sentiment.id)', 'count')
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .andWhere('sentiment.created_at >= :startDate', { startDate })
      .groupBy('DATE(sentiment.created_at)')
      .addGroupBy('sentiment.sentiment')
      .orderBy('DATE(sentiment.created_at)', 'ASC')
      .getRawMany();
  }

  async getTopEmotions({
    userId,
    limit = 10,
  }: {
    userId: string;
    limit?: number;
  }) {
    return this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .select('sentiment.emotion', 'emotion')
      .addSelect('COUNT(sentiment.id)', 'count')
      .addSelect(
        'ROUND((COUNT(sentiment.id) * 100.0 / SUM(COUNT(sentiment.id)) OVER ()), 2)',
        'percentage',
      )
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .andWhere('sentiment.emotion IS NOT NULL')
      .groupBy('sentiment.emotion')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getTopEngagedPosts({
    userId,
    limit = 5,
  }: {
    userId: string;
    limit?: number;
  }) {
    const posts = await this.socialPostRepository
      .createQueryBuilder('post')
      .select('post.*')
      .addSelect('COUNT(comment.id)', 'comment_count')
      .leftJoin('post.comments', 'comment')
      .leftJoin('post.user', 'user')
      .where('user.id = :userId', { userId })
      .groupBy('post.id')
      .orderBy('comment_count', 'DESC')
      .limit(limit)
      .getRawMany();

    for (const post of posts) {
      const sentimentsStats = await this.commentSentimentRepository
        .createQueryBuilder('sentiment')
        .select('sentiment.sentiment', 'sentiment')
        .addSelect('COUNT(sentiment.id)', 'count')
        .innerJoin('sentiment.comment', 'SocialComment')
        .where('SocialComment.post_id = :postId', { postId: post.id })
        .groupBy('sentiment.sentiment')
        .getRawMany();
      post.sentimentsStats = sentimentsStats;
      const topSentiment = sentimentsStats.reduce(
        (prev, curr) => (Number(curr.count) > Number(prev.count) ? curr : prev),
        { sentiment: null, count: 0 }
      );
      console.log(topSentiment)
      post.prevailingSentiment = topSentiment;
      console.log(post)
    }

    return posts;
  }

  async getToneAnalysis({ userId }: { userId: string }) {
    return this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .select('sentiment.tone', 'tone')
      .addSelect('COUNT(sentiment.id)', 'count')
      .addSelect(
        'ROUND((COUNT(sentiment.id) * 100.0 / SUM(COUNT(sentiment.id)) OVER ()), 2)',
        'percentage',
      )
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .andWhere('sentiment.tone IS NOT NULL')
      .groupBy('sentiment.tone')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async getSarcasmStats({ userId }: { userId: string }) {
    const total = await this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .andWhere('sentiment.sarcasm IS NOT NULL')
      .getCount();

    const sarcastic = await this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .andWhere('sentiment.sarcasm = :sarcasm', { sarcasm: true })
      .getCount();

    return {
      total,
      sarcastic,
      percentage: total > 0 ? ((sarcastic / total) * 100).toFixed(2) : 0,
    };
  }

  async getRecentCommentsWithSentiment({
    userId,
    limit = 10,
  }: {
    userId: string;
    limit?: number;
  }) {
    return this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .leftJoinAndSelect('sentiment.comment', 'comment')
      .leftJoinAndSelect('comment.post', 'post')
      .innerJoin('post.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('sentiment.created_at', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getImpactAnalysis({ userId }: { userId: string }) {
    return this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .select('sentiment.impact', 'impact')
      .addSelect('COUNT(sentiment.id)', 'count')
      .addSelect(
        'ROUND((COUNT(sentiment.id) * 100.0 / SUM(COUNT(sentiment.id)) OVER ()), 2)',
        'percentage',
      )
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .innerJoin('SocialPost.user', 'User')
      .where('User.id = :userId', { userId })
      .andWhere('sentiment.impact IS NOT NULL')
      .groupBy('sentiment.impact')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async getSentimentTrend(
    period: 'day' | 'week' | 'month' = 'day',
    startDate?: string,
    endDate?: string,
  ): Promise<SentimentTrendDto[]> {
    const query = this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .select([
        this.getDateTruncExpression(period) + ' AS date',
        `SUM(CASE WHEN sentiment.sentiment = 'positive' THEN 1 ELSE 0 END) AS positive`,
        `SUM(CASE WHEN sentiment.sentiment = 'neutral' THEN 1 ELSE 0 END) AS neutral`,
        `SUM(CASE WHEN sentiment.sentiment = 'negative' THEN 1 ELSE 0 END) AS negative`,
      ])
      .groupBy('date')
      .orderBy('date', 'ASC');

    if (startDate)
      query.andWhere('sentiment.created_at >= :startDate', { startDate });
    if (endDate)
      query.andWhere('sentiment.created_at <= :endDate', { endDate });

    const result = await query.getRawMany();

    return result.map((r) => ({
      date: r.date,
      positive: Number(r.positive),
      neutral: Number(r.neutral),
      negative: Number(r.negative),
    }));
  }

  async getPostWithComments({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }) {
    const post = await this.socialPostRepository.findOne({
      where: { id: postId, user: { id: userId } },
      relations: ['user'],
    });

    if (!post) {
      return null;
    }

    // Buscar estatísticas de sentimentos do post
    const sentimentsStats = await this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .select('sentiment.sentiment', 'sentiment')
      .addSelect('COUNT(sentiment.id)', 'count')
      .addSelect(
        'ROUND((COUNT(sentiment.id) * 100.0 / SUM(COUNT(sentiment.id)) OVER ()), 2)',
        'percentage',
      )
      .innerJoin('sentiment.comment', 'SocialComment')
      .innerJoin('SocialComment.post', 'SocialPost')
      .where('SocialPost.id = :postId', { postId: post.id })
      .groupBy('sentiment.sentiment')
      .getRawMany();

    // Buscar comentários com suas análises
    const commentsWithSentiments = await this.commentSentimentRepository
      .createQueryBuilder('sentiment')
      .leftJoinAndSelect('sentiment.comment', 'comment')
      .leftJoinAndSelect('comment.post', 'post')
      .innerJoin('post.user', 'user')
      .where('post.id = :postId', { postId: post.id })
      .andWhere('user.id = :userId', { userId })
      .orderBy('sentiment.created_at', 'DESC')
      .getMany();

    // Calcular sentimento predominante
    const prevailingSentiment = sentimentsStats.reduce((prev, current) => {
      return Number(current.count) > Number(prev.count) ? current : prev;
    }, sentimentsStats[0] || { sentiment: 'neutral', count: 0, percentage: 0 });

    return {
      ...post,
      sentimentsStats,
      prevailingSentiment,
      commentsWithSentiments,
    };
  }

  private getDateTruncExpression(period: 'day' | 'week' | 'month'): string {
    switch (period) {
      case 'week':
        return `TO_CHAR(DATE_TRUNC('week', sentiment.created_at), 'YYYY-MM-DD')`;
      case 'month':
        return `TO_CHAR(DATE_TRUNC('month', sentiment.created_at), 'YYYY-MM')`;
      default:
        return `TO_CHAR(DATE_TRUNC('day', sentiment.created_at), 'YYYY-MM-DD')`;
    }
  }
}
