import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message, error } = this.normalizeException(exception);

    this.logger.error(
      `${request.method} ${request.url} -> ${statusCode} ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }

  private normalizeException(exception: unknown): {
    statusCode: number;
    message: string;
    error: string;
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return {
          statusCode,
          message: exceptionResponse,
          error: HttpStatus[statusCode] ?? 'HttpException',
        };
      }

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        const messageValue = responseObj.message;
        const errorValue = responseObj.error;

        const message = Array.isArray(messageValue)
          ? messageValue.join(', ')
          : typeof messageValue === 'string'
            ? messageValue
            : exception.message;

        const error =
          typeof errorValue === 'string'
            ? errorValue
            : (HttpStatus[statusCode] ?? 'HttpException');

        return {
          statusCode,
          message,
          error,
        };
      }

      return {
        statusCode,
        message: exception.message,
        error: HttpStatus[statusCode] ?? 'HttpException',
      };
    }

    if (exception instanceof QueryFailedError) {
      const queryError = exception as QueryFailedError & {
        driverError?: { code?: string; detail?: string };
      };

      const code = queryError.driverError?.code;

      if (code === '23505') {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Unique constraint violation',
          error: 'Conflict',
        };
      }

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: queryError.driverError?.detail ?? 'Database query failed',
        error: 'DatabaseError',
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: 'InternalServerError',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'InternalServerError',
    };
  }
}
