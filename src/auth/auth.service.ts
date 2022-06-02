import { Injectable } from '@nestjs/common';
import { AuthDto } from './Dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  signupUser({ password, email }: AuthDto) {
    const newUser = this.prismaService.user.create({
      data: {
        email: email,
        hash: password,
      },
    });
  }

  signInUser() {}

  logoutUser() {}
  refreshToken() {}
}
