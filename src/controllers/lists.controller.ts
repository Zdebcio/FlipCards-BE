import { NextFunction, Request, Response } from 'express';

import { CreateListSchema, GetListSchema, GetListsSchema } from '@/schema/lists.schema';
import ListModel from '@/models/list.model';
import { applyPagination, applySorting } from '@/utils/pagination.utils';
import defaultsConfig from '@/config/defaults.config';
import { Error } from 'mongoose';
import { ObjectId } from 'mongodb';
import FlashcardsInListsModel from '@/models/flashcardsInLists.model';
import FlashcardModel from '@/models/flashcard.model';

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
      const {
        skip = defaultsConfig.skip,
        limit = defaultsConfig.limit,
        sort,
        sortBy,
        forwardText,
        backwardText,
        listID,
      } = GetListSchema.parse({ ...req.query, ...req.params });

      const isValidListID = ObjectId.isValid(listID);
      const userHaveList = ListModel.findOne({ _id: listID, userID: req.user.id });

      if (!isValidListID || !(await userHaveList.exec())) {
        throw new Error.DocumentNotFoundError('Not found');
      }

      const flashcardsInLists = await FlashcardsInListsModel.find({ listID }).populate('flashcardID');

      const flashcardsIDs: string[] = flashcardsInLists.map(item => item.flashcardID);

      const queryConditions = {
        forwardText: { $regex: forwardText ?? '', $options: 'i' },
        backwardText: { $regex: backwardText ?? '', $options: 'i' },
        userID: req.user.id,
        _id: {
          $in: flashcardsIDs,
        },
      };

      const flashcardsQuery = FlashcardModel.find(queryConditions);
      const list = await ListModel.findOne({ _id: listID, userID: req.user.id });

      applyPagination(flashcardsQuery, { skip, limit });
      applySorting(flashcardsQuery, { sortBy, sort });

      const flashcards = await flashcardsQuery.exec();
      const count = await FlashcardModel.find(queryConditions).countDocuments();

      res.status(200).send({ ...list?.toObject(), data: flashcards, count, skip, limit });
    } catch (err) {
      next(err);
    }
  };
}
