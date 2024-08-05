import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const cause = exception.cause;

    const now = new Date().toISOString();

    console.error(`[EXCEPTION] - ${now} - ${exception.stack}`);

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: now,
      cause: cause,
      path: request.url,
    });
  }
}
