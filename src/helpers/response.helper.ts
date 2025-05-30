import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export interface ApiResponse<T = any> {
  statusCode: number;
  message?: string;
  data?: T;
}

export const success = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = HttpStatus.OK,
): Response<ApiResponse<T>> =>
  res.status(statusCode).json({
    statusCode: statusCode,
    message,
    data,
  }) as Response<ApiResponse<T>>;
