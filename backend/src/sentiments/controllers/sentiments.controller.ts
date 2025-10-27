import { Controller, Get, Query, Request } from '@nestjs/common';
import { SentimentsService } from '../services/sentiments.service';

@Controller('sentiments')
export class SentimentsController {
  constructor(private readonly sentimentsService: SentimentsService) {}

  @Get()
  findAll(@Request() req: Request & { user: { sub: string } }) {
    return this.sentimentsService.findAllSentiments({ userId: req.user.sub });
  }

  @Get('posts')
  findAllPosts(
    @Request() req: Request & { user: { sub: string } },
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    const userId = req.user.sub;
    return this.sentimentsService.findAllPosts({ userId, page, size });
  }

  @Get('dashboard/overview')
  getDashboardOverview(@Request() req: Request & { user: { sub: string } }) {
    return this.sentimentsService.getDashboardOverview({
      userId: req.user.sub,
    });
  }

  @Get('trend')
  getSentimentsTrend(
    @Request() req: Request & { user: { sub: string } },
    @Query('days') days?: number,
  ) {
    return this.sentimentsService.getSentimentsTrend({
      userId: req.user.sub,
      days: days ? Number(days) : 30,
    });
  }

  @Get('emotions/top')
  getTopEmotions(
    @Request() req: Request & { user: { sub: string } },
    @Query('limit') limit?: number,
  ) {
    return this.sentimentsService.getTopEmotions({
      userId: req.user.sub,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get('posts/top-engaged')
  getTopEngagedPosts(
    @Request() req: Request & { user: { sub: string } },
    @Query('limit') limit?: number,
  ) {
    return this.sentimentsService.getTopEngagedPosts({
      userId: req.user.sub,
      limit: limit ? Number(limit) : 5,
    });
  }

  @Get('tone/analysis')
  getToneAnalysis(@Request() req: Request & { user: { sub: string } }) {
    return this.sentimentsService.getToneAnalysis({ userId: req.user.sub });
  }

  @Get('sarcasm/stats')
  getSarcasmStats(@Request() req: Request & { user: { sub: string } }) {
    return this.sentimentsService.getSarcasmStats({ userId: req.user.sub });
  }

  @Get('comments/recent')
  getRecentCommentsWithSentiment(
    @Request() req: Request & { user: { sub: string } },
    @Query('limit') limit?: number,
  ) {
    return this.sentimentsService.getRecentCommentsWithSentiment({
      userId: req.user.sub,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get('impact/analysis')
  getImpactAnalysis(@Request() req: Request & { user: { sub: string } }) {
    return this.sentimentsService.getImpactAnalysis({ userId: req.user.sub });
  }
}