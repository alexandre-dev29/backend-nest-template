import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './Dto';
import { Tokens } from './types';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signupUser')
  signupUser(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signupUser(authDto);
  }

  @Post('local/signInUser')
  signInUser(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signInUser(authDto);
  }

  @Post('logoutUser')
  @UseGuards(AuthGuard('jwt'))
  logoutUser(@Req() req: Request) {
    const user = req.user;
    this.authService.logoutUser(user['id']);
  }

  @Post('refreshToken')
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshToken() {
    this.authService.refreshToken();
  }
}
