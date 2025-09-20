import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface RequestWithCookies extends Request {
  user?: JwtPayload;
  cookies: {
    refresh_token?: string;
    [key: string]: string | undefined;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  use(req: RequestWithCookies, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(accessToken);
      req.user = payload;
      return next();
    } catch (err: unknown) {
      this.logger.warn(`Access token error: ${(err as Error).message}`);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
