import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { extractBearerToken, verifyAccessToken } from '../../../utils';
import { User } from '../user.schema';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Authorization token is required');
    }

    try {
      const payload = await verifyAccessToken(this.jwtService, token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found for this token');
      }

      req.user = user;
      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
