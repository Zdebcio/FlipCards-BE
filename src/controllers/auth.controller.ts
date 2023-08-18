import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { MongoError } from 'mongodb';

import UserModel from '@/models/user.model';
import { AuthSchema } from '@/schema/auth.schema';
import { generateAccessToken } from '@/utils/auth.utils';

const comparePassword = (password: string, hashPassword: string) => bcrypt.compareSync(password, hashPassword);

export default class AuthController {
  public login = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user || !comparePassword(req.body.password, user.password))
        return res.status(422).send({
          code: 'auth_invalid',
          message: 'Incorrect email or password',
        });

      const accessToken = generateAccessToken(user._id);

      res.header('Authorization', accessToken).header('Access-Control-Expose-Headers', 'authorization').status(200).send({
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  };

  public register = async (req: Request, res: Response) => {
    try {
      AuthSchema.parse(req.body);

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const user = new UserModel({
        ...req.body,
        password: hashPassword,
      });

      await user.save();
      res.sendStatus(201);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).send(err.issues);
      }

      if (err instanceof MongoError && err.code === 11000) return res.status(409).send(err);

      res.status(400).send(err);
    }
  };
}
