import { JwtService } from '@nestjs/jwt';

export interface UserTokenPayload {
  sub: string;
}

export async function createAccessToken(
  jwtService: JwtService,
  payload: UserTokenPayload,
): Promise<string> {
  return jwtService.signAsync(payload);
}

export async function verifyAccessToken(
  jwtService: JwtService,
  token: string,
): Promise<UserTokenPayload> {
  return jwtService.verifyAsync<UserTokenPayload>(token);
}
