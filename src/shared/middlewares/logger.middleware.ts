import { NextFunction, Request, Response } from 'express';

export function LoggerMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  console.info(
    `[INFO] - ${new Date().toISOString()} - ${req.ip} at ${req.url} - Cacheable ${!req.fresh}`,
  );
  next();
}
