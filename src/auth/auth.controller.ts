import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './Dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signupUser')
  signupUser(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signupUser(authDto);
  }

  @Post('/local/signInUser')
  signInUser() {
    this.authService.signInUser();
  }

  @Post('/logoutUser')
  logoutUser() {
    this.authService.logoutUser();
  }

  @Post('/refreshToken')
  refreshToken() {
    this.authService.refreshToken();
  }
}
