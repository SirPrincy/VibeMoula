import type { Request, Response, NextFunction } from 'express';
import { AppError } from './error';

export const checkApiKey = (req: Request, _res: Response, next: NextFunction) => {
  const adminKey = process.env.VIBEMOULA_ADMIN_KEY || 'debug_key_123';
  const providedKey = req.headers['x-admin-key'];

  if (!providedKey || providedKey !== adminKey) {
    return next(new AppError('Unauthorized: Missing or invalid Admin Key', 401));
  }
  
  next();
};
