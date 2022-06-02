import { Injectable } from '@nestjs/common';
import { AuthDto } from './Dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { hashData, getTokens } from '../Utilities/index';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signupUser({ password, email }: AuthDto): Promise<Tokens> {
    const hash = await hashData(password);
    const newUser = await this.prismaService.user.create({
      data: {
        email: email,
        hash,
      },
    });

    const tokens = await getTokens(newUser.id, newUser.email, this.jwtService);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    return tokens;
  }

  signInUser() {}

  logoutUser() {}
  refreshToken() {}

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await hashData(refreshToken);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
}
