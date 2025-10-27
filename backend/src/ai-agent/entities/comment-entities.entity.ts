import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CommentSentiment } from "./comment-sentiments.entity";

@Entity('comment_entities')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommentSentiment, (sentiment) => sentiment.entities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sentiment_id' })
  sentiment: CommentSentiment;

  @Column({ name: 'entity_name', type: 'varchar', length: 100 })
  entityName: string;
}