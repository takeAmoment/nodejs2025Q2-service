import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ErorrMessagesEnum } from 'src/constants';
import { LoggingService } from '../logger/logging.service';

@Catch()
@Injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : ErorrMessagesEnum.INTERNAL_SERVER_ERROR;

    this.loggerService.error(
      `${status} Error: ${JSON.stringify(message)} | Path: ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
