import { SocialComment } from 'src/social-media/entities/social-comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from './comment-entities.entity';
import { CommentHashtag } from './comment-hashtag.entity';

@Entity('comment_sentiments')
export class CommentSentiment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SocialComment, (comment) => comment.sentiments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: SocialComment;

  @Column({ name: 'sentiment', type: 'varchar', length: 20 })
  sentiment: string;

  @Column({ name: 'intensity', type: 'varchar', length: 20, nullable: true })
  intensity?: string;

  @Column({ name: 'emotion', type: 'varchar', length: 20, nullable: true })
  emotion?: string;

  @Column({
    name: 'sentiment_value',
    type: 'numeric',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  sentimentValue?: number;

  @Column({ type: 'text', nullable: true })
  motivation?: string;

  @Column({
    name: 'interaction_type',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  interactionType?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  impact?: string;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  tone?: string;

  @Column({ type: 'boolean', nullable: true })
  sarcasm?: boolean;

  @OneToMany(() => CommentEntity, (entity) => entity.sentiment, {
    cascade: true,
  })
  entities?: CommentEntity[];

  @OneToMany(() => CommentHashtag, (hashtag) => hashtag.sentiment, {
    cascade: true,
  })
  hashtags?: CommentHashtag[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
