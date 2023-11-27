import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { MongoError } from 'mongodb';

import { CreateListSchema, GetUserListsSchema, GetUserListsType } from '@/schema/lists.schema';
import ListModel from '@/models/list.model';
import { PaginationSchema, PaginationType } from '@/schema/pagination.schema';
import { applyPagination, applySorting } from '@/utils/pagination.utils';

export default class ListsController {
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

  public getUserLists = async (req: Request<{}, {}, GetUserListsType, PaginationType>, res: Response) => {
    const { name } = req.body;
    const { skip, limit, sort, sortBy } = req.query;

    try {
      GetUserListsSchema.parse(req.body);
      PaginationSchema.parse(req.query);

      const lists = await ListModel.find({
        name: { $regex: name, $options: 'i' },
        userID: req.user.id,
      });

      applyPagination(lists, { skip, limit });
      applySorting(lists, { sortBy, sort });

      res.status(200).send(lists);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).send(err.issues);
      }

      if (err instanceof MongoError) return res.status(409).send(err);

      res.status(400).send(err);
    }
  };
}
