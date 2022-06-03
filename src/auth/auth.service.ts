import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './Dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { hashData, getTokens } from '../Utilities/index';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signupUser({ password, email }: AuthDto): Promise<Tokens | any> {
    const hash = await hashData(password);
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (existingUser)
        throw new Error(
          'This User Already Exist please try another email or signin',
        );

      const newUser = await this.prismaService.user.create({
        data: {
          email: email,
          hash,
        },
      });
      const tokens = await getTokens(
        newUser.id,
        newUser.email,
        this.jwtService,
      );
      await this.updateRefreshToken(newUser.id, tokens.refresh_token);
      return tokens;
    } catch (err: any) {
      return {
        responseType: 'error',
        message: err.message,
      };
    }
  }

  async signInUser({ email, password }: AuthDto): Promise<Tokens> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      throw new ForbiddenException({
        responseType: 'error',
        message: `Email doesn't exist`,
      });
    }
    const passwordMatches = await bcrypt.compare(password, existingUser.hash);
    if (!passwordMatches) {
      throw new ForbiddenException({
        responseType: 'error',
        message: `Password Incorrect please try another or Process Forget password`,
      });
    }
    const tokens = await getTokens(
      existingUser.id,
      existingUser.email,
      this.jwtService,
    );
    await this.updateRefreshToken(existingUser.id, tokens.refresh_token);
    return tokens;
  }

  async logoutUser(userId: number) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }
  async refreshToken(userId: number, refreshToken: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser || existingUser.hashedRt == null) {
      throw new ForbiddenException({
        responseType: 'error',
        message: `Access Denied`,
      });
    }
    const refreshMatches = await bcrypt.compare(
      refreshToken,
      existingUser.hashedRt,
    );
    if (!refreshMatches) {
      if (!existingUser) {
        throw new ForbiddenException({
          responseType: 'error',
          message: `Access Denied`,
        });
      }
    }
    const tokens = await getTokens(
      existingUser.id,
      existingUser.email,
      this.jwtService,
    );
    await this.updateRefreshToken(existingUser.id, tokens.refresh_token);
    return tokens;
  }

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
