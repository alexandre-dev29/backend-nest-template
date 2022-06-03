import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './Dto';
import { Tokens } from './types';

import { CurrentUserRest, PublicRoute } from './Common/decorators';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from './Common/decorators/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signupUser')
  signupUser(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signupUser(authDto);
  }

  @Post('local/signInUser')
  @PublicRoute()
  signInUser(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signInUser(authDto);
  }

  @Post('logoutUser')
  logoutUser(@CurrentUserRest('sub') userId: number) {
    return this.authService.logoutUser(userId);
  }

  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  @Post('refreshToken')
  refreshToken(
    @CurrentUserRest('sub') userId: number,
    @CurrentUserRest('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
