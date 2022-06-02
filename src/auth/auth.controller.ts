import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/local/signupUser')
  signupUser() {
    this.authService.signInUser();
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
