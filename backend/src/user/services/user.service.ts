import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { User } from '../entities/user.entity';
import * as crypto from 'crypto';
import { Token, TokenType } from '../entities/token.entity';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcryptjs';
import { AuthProviderEnum } from 'src/auth/dto/credentials.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly emailService: EmailService,
  ) {}

  async create(
    user: Partial<User> & { provider?: AuthProviderEnum },
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: user.email }, { username: user.username }],
    });
    if (existingUser && existingUser.email === user.email) {
      throw new Error('User with this email already exists');
    }
    if (existingUser && existingUser.username === user.username) {
      throw new Error('User with this username already exists');
    }
    if (!user.provider) {
      user.provider = AuthProviderEnum.LOCAL;
    }
    if (user.provider === AuthProviderEnum.LOCAL && !user.password) {
      throw new Error('Password is required for local users');
    }
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    const newUser = await this.userRepository.save(user);
    await this.sendVerificationEmail(newUser);
    return newUser;
  }

  private async sendVerificationEmail(user: User) {
    const token = await this.generateEmailVerificationToken(user);
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Email Verification',
      content: `Please verify your email by clicking on the following link: ${token}`,
    });
  }
  private async generateEmailVerificationToken(user: User): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const emailToken = new Token({
      token,
      tokenType: TokenType.EMAIL_VERIFICATION,
      expiresAt: tokenExpiration,
      user: user,
    });
    await this.tokenRepository.save(emailToken);
    return emailToken.token;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const emailToken = await this.tokenRepository.findOne({
      where: {
        token,
        tokenType: TokenType.EMAIL_VERIFICATION,
        isRevoked: false,
      },
      relations: ['user'],
    });
    if (!emailToken) {
      throw new NotFoundException('Invalid or expired verification token');
    }
    const user = emailToken.user;
    user.isVerified = true;
    await this.userRepository.save(user);
    await this.tokenRepository.remove(emailToken);
    return { message: 'Email verified successfully' };
  }

  async findOne(identifier: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [
        { id: identifier, isActive: true },
        { username: identifier, isActive: true },
        { email: identifier, isActive: true },
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    delete updateData.password;
    await this.userRepository.update(id, updateData);
    const updatedUser = await this.userRepository.findOne({
      where: { id, isActive: true },
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async sendResetPasswordEmail(username: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email: username }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = await this.generateResetPasswordToken(user);
    this.logger.log(`Password reset token generated for user ${user.username}`);
    await this.emailService.sendEmail({
      content: `${token}`,
      subject: 'Password Reset',
      to: user.email,
    });
    return { message: 'Password reset email sent' };
  }

  private async generateResetPasswordToken(user: User): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    const resetToken = new Token({
      token,
      tokenType: TokenType.PASSWORD_RESET,
      expiresAt: tokenExpiration,
      user: user,
    });
    await this.tokenRepository.save(resetToken);
    return resetToken.token;
  }

  async resetPassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const resetToken = await this.tokenRepository.findOne({
      where: { token, tokenType: TokenType.PASSWORD_RESET, isRevoked: false },

      relations: ['user'],
    });
    if (!resetToken) {
      throw new NotFoundException('Invalid or expired reset token');
    }
    const user = resetToken.user;
    user.password = bcrypt.hashSync(newPassword, 10);
    await this.userRepository.save(user);
    resetToken.isRevoked = true;
    await this.tokenRepository.save(resetToken);
    return { message: 'Password reset successfully' };
  }
}
