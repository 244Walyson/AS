export interface SentimentDistribution {
  sentiment: string;
  count: number;
  percentage: number;
}

export interface DashboardOverview {
  totalPosts: number;
  totalComments: number;
  sentimentDistribution: SentimentDistribution[];
  averageSentimentValue: string | null;
}

export interface SentimentTrend {
  date: string;
  sentiment: string;
  count: number;
}

export interface TopEmotion {
  emotion: string;
  count: number;
  percentage: number;
}

export interface SentimentStats {
  sentiment: string;
  count: number;
}

export interface TopEngagedPost {
  id: string;
  caption: string;
  comment_count: number;
  sentimentsStats: SentimentStats[];
  prevailingSentiment: SentimentStats;
  media_url: string;
  s3_media_url: string;
  media_type: string;
  permalink: string;
  timestamp: string;
  platform: "instagram";
}

export interface RecentComment {
  id: string;
  comment: {
    id: string;
    text: string;
    username?: string;
    timestamp?: string;
    post: { id: string; caption: string };
  };
  sentiment: string;
  emotion?: string;
  created_at?: string;
  timestamp?: string;
}

export interface ToneAnalysis {
  tone: string;
  count: number;
  percentage: number;
}

export interface SarcasmStats {
  total: number;
  sarcastic: number;
  percentage: string;
}

export interface ImpactAnalysis {
  impact: string;
  count: number;
  percentage: number;
}

export interface SentimentTrendDto {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PostWithComments {
  id: string;
  caption?: string;
  mediaType?: string;
  mediaUrl?: string;
  s3MediaUrl?: string;
  permalink?: string;
  timestamp?: string;
  platform: string;
  sentimentsStats: SentimentStats[];
  prevailingSentiment: SentimentStats & { percentage: number };
  commentsWithSentiments: CommentWithSentiment[];
}

export interface CommentWithSentiment {
  id: string;
  sentiment: string;
  emotion?: string;
  intensity?: string;
  sentimentValue?: number;
  tone?: string;
  sarcasm?: boolean;
  impact?: string;
  motivation?: string;
  feedback?: string;
  comment: {
    id: string;
    text?: string;
    username?: string;
    timestamp?: string;
    likeCount?: number;
  };
  createdAt?: string;
}

export interface PaginatedPosts {
  content: PostItem[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface PostItem {
  id: string;
  caption?: string;
  mediaType?: string;
  mediaUrl?: string;
  s3MediaUrl?: string;
  permalink?: string;
  timestamp?: string;
  platform: string;
  sentimentsStats: SentimentStats[];
}