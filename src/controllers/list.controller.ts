import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { MongoError } from 'mongodb';

import { CreateListSchema } from '@/schema/list.schema';
import ListModel from '@/models/list.model';

export default class ListController {
  public create = async (req: Request, res: Response) => {
    try {
      CreateListSchema.parse(req.body);

      const newList = new ListModel({
        ...req.body,
        userID: req.user.id,
      });

      await newList.save();
      res.sendStatus(201);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).send(err.issues);
      }

      if (err instanceof MongoError) return res.status(409).send(err);

      res.status(400).send(err);
    }
  };
}
