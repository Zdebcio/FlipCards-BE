import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import UserModel from '@/models/user.model';
import { AuthSchema } from '@/schema/auth.schema';
import { generateAccessToken } from '@/utils/auth.utils';
import { Error } from 'mongoose';

const comparePassword = (password: string, hashPassword: string) => bcrypt.compareSync(password, hashPassword);

export default class AuthController {
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user || !comparePassword(req.body.password, user.password))
        return res.status(422).send({
          code: 'auth_invalid',
          message: 'Incorrect email or password',
        });

      const accessToken = generateAccessToken(user._id);

      res.header('Authorization', `Bearer ${accessToken}`).header('Access-Control-Expose-Headers', 'authorization').status(200).send({
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      AuthSchema.parse(req.body);

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const userExist = await UserModel.findOne({ email: req.body.email });

      if (userExist) {
        throw new Error.ValidatorError({
          message: 'User already exist',
          value: req.body.email,
          path: 'email',
        });
      }

      const user = new UserModel({
        ...req.body,
        password: hashPassword,
      });

      await user.save();
      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  };
}
