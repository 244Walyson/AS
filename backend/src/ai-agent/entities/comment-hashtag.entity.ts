import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentSentiment } from './comment-sentiments.entity';

@Entity('comment_hashtags')
export class CommentHashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommentSentiment, (sentiment) => sentiment.hashtags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sentiment_id' })
  sentiment: CommentSentiment;

  @Column({ type: 'varchar', length: 100 })
  hashtag: string;
}
