import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import ErrorResponse from './interfaces/ErrorResponse.interface';
import { TOKEN_SECRET } from './config/env.config';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET ?? '', (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}
