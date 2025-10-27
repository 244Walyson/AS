import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.decorator';
import { GoogleAuthService } from 'src/user/services/google-auth.service';
import { LocalAuthService } from 'src/user/services/local-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly localAuthService: LocalAuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Public()
  @Post('/token')
  @HttpCode(200)
  generateAccessToken(@Body() CredentialsDto: CredentialsDto) {
    return this.localAuthService.generateAccessToken(CredentialsDto);
  }

  @Public()
  @Post('/google')
  @HttpCode(200)
  generateAccessTokenWithGoogleProvider(@Body() dto: OauthCredentialsDto) {
    return this.googleAuthService.generateAccessTokenWithGoogleProvider(dto);
  }

  @Public()
  @Post('/recovery-password/token')
  @HttpCode(200)
  createRecoveryPasswordToken(@Body() dto: RecoveryPasswordDto) {
    return this.localAuthService.generateRecoveryPasswordToken({
      email: dto.email,
    });
  }

  @Public()
  @Post('/recovery-password')
  @HttpCode(200)
  recoveryPassword(@Body() dto: RecoveryPasswordTokenDto) {
    return this.localAuthService.recoveryPassword(dto);
  }
}
