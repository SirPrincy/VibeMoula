import { Request, Response, NextFunction } from 'express';
import { z, ThrownError } from 'zod';

export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      });
    }
    next(error);
  }
};
