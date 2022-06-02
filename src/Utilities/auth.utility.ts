import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tokens } from 'src/auth/types';

export const hashData = (data: string): Promise<string> => {
  return bcrypt.hash(data, 10);
};

export const getTokens = async (
  userId: number,
  email: string,
  jwtService: JwtService,
): Promise<Tokens> => {
  const [accessToken, refreshToken] = await Promise.all([
    jwtService.signAsync(
      { sub: userId, email },
      { expiresIn: 60 * 15, secret: 'secretKey' },
    ),
    jwtService.signAsync(
      { sub: userId, email },
      { expiresIn: 60 * 60 * 24 * 7, secret: 'secretKey' },
    ),
  ]);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  } as Tokens;
};
