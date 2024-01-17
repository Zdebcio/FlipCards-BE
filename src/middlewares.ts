import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { TOKEN_SECRET } from './config/env.config';
import { ZodError } from 'zod';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import { ErrorType } from './types/Error.types';

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
  error: Error,
  req: Request,
  // res: Response<ErrorResponse>,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if (error instanceof ZodError) {
    console.log(error);
    res.status(422);
    return res.json({
      status: 422,
      message: 'Validation error',
      details: error.errors,
    });
  }

  if (error instanceof MongoError) {
    res.status(500);
    return res.json({
      status: 500,
      message: 'Database error',
      details: error.message,
    });
  }

  if (error instanceof Error.ValidatorError) {
    if (error.kind === ErrorType.Duplicate) {
      res.status(409);
      return res.json({
        status: 409,
        message: 'Duplicated item',
        details: error,
      });
    }
    res.status(422);
    return res.json({
      status: 422,
      message: 'Validation error',
      details: error,
    });
  }

  res.status(500);
  return res.json({
    status: 500,
    message: 'Unexpected error',
    details: error.message || {},
  });
}
