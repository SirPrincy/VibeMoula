import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    const issues = error.issues || error.errors;
    if (issues && Array.isArray(issues)) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: issues.map((e: any) => ({
          path: Array.isArray(e.path) ? e.path.join('.') : '',
          message: e.message
        }))
      });
    }
    next(error);
  }
};
