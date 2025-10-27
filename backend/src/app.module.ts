import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppDataSource } from './config/db.config';
import { EmailModule } from './email/email.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { UserModule } from './user/user.module';
import { SentimentsModule } from './sentiments/sentiments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    AuthModule,
    EmailModule,
    SocialMediaModule,
    AiAgentModule,
    SentimentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
