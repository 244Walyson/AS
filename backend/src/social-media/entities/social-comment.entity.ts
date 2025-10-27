import { CommentSentiment } from 'src/ai-agent/entities/comment-sentiments.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SocialPost } from './social-post.entity';

@Entity('social_comments')
export class SocialComment {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => SocialPost, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: SocialPost;

  @Column({ name: 'post_id' })
  postId: string;

  @Column({ length: 100, nullable: true })
  username?: string;

  @Column({ type: 'text', nullable: true })
  text?: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp?: Date;

  @Column({ name: 'like_count', type: 'int', nullable: true })
  likeCount?: number;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => CommentSentiment, (sentiment) => sentiment.comment)
  sentiments: CommentSentiment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
