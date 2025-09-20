import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

export enum TokenType {
  REFRESH = 'refresh',
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
}

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: TokenType })
  tokenType: TokenType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  issuedAt: Date;

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt: Date | null;

  constructor(partial: Partial<Token>) {
    Object.assign(this, partial);
  }
}
