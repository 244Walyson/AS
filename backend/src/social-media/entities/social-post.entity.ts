import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { SocialComment } from "./social-comment.entity";

@Entity('social_posts')
export class SocialPost {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column({ length: 50 })
  platform: string;

  @Column({ type: 'text', nullable: true })
  caption?: string;

  @Column({ name: 'media_type', nullable: true })
  mediaType?: string;

  @Column({ name: 'media_url', type: 'text', nullable: true })
  mediaUrl?: string;

  @Column({ name: 's3_media_url', type: 'text', nullable: true })
  s3MediaUrl?: string;

  @Column({ type: 'text', nullable: true })
  permalink?: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp?: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => SocialComment, (comment) => comment.post, { cascade: true })
  comments: SocialComment[];
}
