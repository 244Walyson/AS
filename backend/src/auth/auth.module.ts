import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleOauthService } from './services/google-oauth.service';
import { LocalAuthService } from './services/local-auth.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Token } from 'src/user/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    UserModule,
    TypeOrmModule.forFeature([User, Token]),
  ],
  controllers: [AuthController],
  providers: [GoogleOauthService, LocalAuthService],
})
export class AuthModule {}
