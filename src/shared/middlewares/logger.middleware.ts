import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../logger/logging.service';
import { REQUEST_COLOR, RESPONSE_COLOR } from 'src/constants';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, query, body, originalUrl } = req;
    const start = Date.now();

    this.logger.log(
      `${REQUEST_COLOR}Request: ${method} ${originalUrl} | Query params: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`,
      '',
    );

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `${RESPONSE_COLOR}Response ->  Status code: ${res.statusCode} | Duration: (${duration}ms)`,
        '',
      );
    });

    next();
  }
}
