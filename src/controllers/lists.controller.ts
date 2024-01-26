import { NextFunction, Request, Response } from 'express';

import { CreateListSchema, GetListSchema, GetListsSchema } from '@/schema/lists.schema';
import ListModel from '@/models/list.model';
import { applyPagination, applySorting } from '@/utils/pagination.utils';
import defaultsConfig from '@/config/defaults.config';
import { Error } from 'mongoose';
import { ObjectId } from 'mongodb';

export default class ListsController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      CreateListSchema.parse(req.body);

      const newList = new ListModel({
        ...req.body,
        userID: req.user.id,
      });

      await newList.save();
      res.status(201).send(newList);
    } catch (err) {
      next(err);
    }
  };

  public getLists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { skip = defaultsConfig.skip, limit = defaultsConfig.limit, sort, sortBy, name } = GetListsSchema.parse(req.query);

      const queryConditions = {
        name: { $regex: name ?? '', $options: 'i' },
        userID: req.user.id,
      };

      const query = ListModel.find(queryConditions);
      const countQuery = ListModel.countDocuments(queryConditions);

      applyPagination(query, { skip, limit });
      applySorting(query, { sortBy, sort });

      const lists = await query.exec();
      const count = await countQuery.exec();

      res.status(200).send({ data: lists, count, skip, limit });
    } catch (err) {
      next(err);
    }
  };

  public getList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listID } = GetListSchema.parse(req.params);

      const isValidListID = ObjectId.isValid(listID);
      const userHaveList = ListModel.findOne({ _id: listID, userID: req.user.id });

      if (!isValidListID || !(await userHaveList.exec())) {
        throw new Error.DocumentNotFoundError('Not found');
      }

      const list = await ListModel.findOne({ _id: listID, userID: req.user.id });

      res.status(200).send(list);
    } catch (err) {
      next(err);
    }
  };
}
