import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter, SentMessageInfo } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const host = this.configService.get<string>('EMAIL_HOST') as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const user = this.configService.get<string>('EMAIL_USER') as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const pass = this.configService.get<string>('EMAIL_PASS') as string;

    if (!host || !user || !pass) {
      this.logger.error('Email configuration missing');
      throw new Error('Email configuration missing');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host,
      port: 587,
      secure: false,
      auth: { user, pass },
    });
  }

  async sendEmail({
    to,
    subject,
    content,
  }: {
    to: string;
    subject: string;
    content: string;
  }): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const info = (await this.transporter.sendMail({
        from: '"Senti" <noreply@senti.com>',
        to,
        subject,
        html: content,
      })) as SentMessageInfo;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Success sending email: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}`, error);
      throw new Error('Error sending email');
    }
  }
}
