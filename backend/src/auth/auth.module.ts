import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/middlewares/auth.guard';
import { Token } from 'src/user/entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { GoogleOauthService } from './services/google-oauth.service';
import { LocalAuthService } from './services/local-auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    UserModule,
    TypeOrmModule.forFeature([User, Token]),
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, GoogleOauthService, LocalAuthService],
})
export class AuthModule {}
