import { NextFunction, Request, Response } from 'express';

import { CreateListSchema, GetListSchema, GetListType, GetUserListsSchema, GetUserListsType } from '@/schema/lists.schema';
import ListModel from '@/models/list.model';
import { PaginationType } from '@/schema/pagination.schema';
import { applyPagination, applySorting } from '@/utils/pagination.utils';
import defaultsConfig from '@/config/defaults.config';
import { ObjectId } from 'mongodb';
import { Error } from 'mongoose';

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

  public getUserLists = async (req: Request<{}, {}, GetUserListsType, GetUserListsType & PaginationType>, res: Response, next: NextFunction) => {
    try {
      const { skip = defaultsConfig.skip, limit = defaultsConfig.limit, sort, sortBy, name } = GetUserListsSchema.parse(req.query);

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

  public getList = async (req: Request<GetListType, {}, {}, {}>, res: Response, next: NextFunction) => {
    try {
      const { listID } = GetListSchema.parse(req.params);

      const checkIsFound = (value: unknown) => {
        if (!value) throw new Error.DocumentNotFoundError('Not found');
      };

      const isValidID = ObjectId.isValid(listID);
      checkIsFound(isValidID);

      const queryConditions = {
        _id: listID,
        userID: req.user.id,
      };

      const list = await ListModel.findOne(queryConditions);
      checkIsFound(list);

      res.status(200).send(list);
    } catch (err) {
      next(err);
    }
  };
}
