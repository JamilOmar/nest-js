import { Body, Controller, Post } from '@nestjs/common';
import { AccessToken } from './access-token.interface';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  public async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    await this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  public async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<AccessToken> {
    return this.authService.signIn(authCredentialsDto);
  }
}
