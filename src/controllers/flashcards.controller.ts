import defaultsConfig from '@/config/defaults.config';
import FlashcardModel from '@/models/flashcard.model';
import FlashcardsInListsModel from '@/models/flashcardsInLists.model';
import ListModel from '@/models/list.model';
import { CreateFlashcardSchema, CreateFlashcardType, DeleteFlashcardSchema, GetFlashcardsSchema } from '@/schema/flashcards.schema';
import { ErrorType } from '@/types/Error.types';
import { applyPagination, applySorting } from '@/utils/pagination.utils';
import { NextFunction, Request, Response } from 'express';
import { MongoError, ObjectId } from 'mongodb';
import { Error } from 'mongoose';

export default class FlashcardsController {
  public create = async (req: Request<{}, {}, CreateFlashcardType>, res: Response, next: NextFunction) => {
    try {
      const { forwardText, backwardText, listIDs } = req.body;

      CreateFlashcardSchema.parse(req.body);

      const idsNotValid = listIDs.filter(id => !ObjectId.isValid(id));

      if (idsNotValid.length) {
        throw new Error.ValidatorError({
          message: `${idsNotValid.join(', ')} are not valid`,
          value: idsNotValid,
          path: '_id',
          type: ErrorType.Validation,
        });
      }

      const existingDocuments = await ListModel.find({ _id: { $in: listIDs }, userID: req.user.id }).distinct('_id');

      const notExistLists = listIDs.filter(listID => existingDocuments.findIndex(doc => doc._id.equals(listID)) === -1);

      if (notExistLists.length) {
        throw new Error.ValidatorError({
          message: `${notExistLists.join(', ')} no exists`,
          value: notExistLists,
          path: '_id',
          type: ErrorType.Validation,
        });
      }

      const newFlashcard = new FlashcardModel({
        forwardText,
        backwardText,
        userID: req.user.id,
      });

      const connectionsWithLists = listIDs.map(listID => ({ flashcardID: newFlashcard.id, listID, userID: req.user.id }));

      await newFlashcard.save();

      await FlashcardsInListsModel.insertMany(connectionsWithLists);

      res.status(201).send(newFlashcard);
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listID, flashcardID } = DeleteFlashcardSchema.parse(req.params);

      const isListIdNotValid = !ObjectId.isValid(listID);

      if (isListIdNotValid) {
        throw new Error.ValidatorError({
          message: `${listID} is not valid`,
          value: listID,
          path: 'listID',
          type: ErrorType.Validation,
        });
      }

      const isFlashcardIdNotValid = !ObjectId.isValid(flashcardID);

      if (isFlashcardIdNotValid) {
        throw new Error.ValidatorError({
          message: `${flashcardID} is not valid`,
          value: flashcardID,
          path: 'flashcardID',
          type: ErrorType.Validation,
        });
      }

      const deletingStatus = await FlashcardsInListsModel.deleteOne({ flashcardID, listID, userID: req.user.id });

      if (deletingStatus.deletedCount === 0) {
        throw new MongoError('Flashcard is not connected to list');
      }

      const flashcardInList = await FlashcardsInListsModel.findOne({ flashcardID, userID: req.user.id });

      if (!flashcardInList) {
        await FlashcardModel.deleteOne({ _id: flashcardID, userID: req.user.id });
      }

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };

  public getFlashcards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        skip = defaultsConfig.skip,
        limit = defaultsConfig.limit,
        sort,
        sortBy,
        forwardText,
        backwardText,
        listID,
      } = GetFlashcardsSchema.parse({ ...req.query, ...req.params });

      if (listID) {
        const isValidID = ObjectId.isValid(listID);

        const userHaveList = ListModel.findOne({ userID: req.user.id });

        if (!isValidID || !(await userHaveList.exec())) {
          throw new Error.DocumentNotFoundError('Not found');
        }
      }

      const flashcardsInLists = await FlashcardsInListsModel.find(listID ? { listID } : {}).populate('flashcardID');

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

      applyPagination(flashcardsQuery, { skip, limit });
      applySorting(flashcardsQuery, { sortBy, sort });

      const flashcards = await flashcardsQuery.exec();
      const count = await FlashcardModel.find(queryConditions).countDocuments();

      res.status(200).send({ data: flashcards, count, skip, limit });
    } catch (err) {
      next(err);
    }
  };
}
