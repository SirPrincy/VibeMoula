import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500, public details?: any) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[ERROR] ${err.message}`, isDev ? err.stack : '');

  res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 && !isDev ? 'Internal Server Error' : err.message,
    ...(isDev && { stack: err.stack, details: err.details })
  });
};
