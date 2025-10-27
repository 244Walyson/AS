import { SocialPost } from 'src/social-media/entities/social-post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Token } from './token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  password?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => SocialPost, (post) => post.user)
  posts: SocialPost[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
