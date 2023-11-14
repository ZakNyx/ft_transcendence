import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class AllExceptionFilter implements ExceptionFilter {
  
    catch(exception: unknown, host: ArgumentsHost): void {
      let message: string;
  
      // console.log("EXCEPTION")
      if (host.getType() == 'http') {
        const ctx = host.switchToHttp();
  
        const response = ctx.getResponse<Response>();
        const status =
          exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        message =
          exception instanceof HttpException
            ? exception.message
            : 'Internal Server Error';
        
        if (status == 401) {
          response.redirect('http://localhost:5173');
          return;
        }
        else if(status == 400)
          return null;
        else {
          response.status(status).json({
            statusCode: status,
            message: `${message}`,
          });
        }
      }
    }
  }