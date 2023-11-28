import FlashcardModel from '@/models/flashcard.model';
import FlashcardsInListsModel from '@/models/flashcardsInLists.model';
import ListModel from '@/models/list.model';
import { CreateFlashcardSchema, CreateFlashcardType } from '@/schema/flashcards.schema';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
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
        });
      }

      const existingDocuments = await ListModel.find({ _id: { $in: listIDs }, userID: req.user.id }).distinct('_id');

      const notExistLists = listIDs.filter(listID => existingDocuments.findIndex(doc => doc._id.equals(listID)) === -1);

      if (notExistLists.length) {
        throw new Error.ValidatorError({
          message: `${notExistLists.join(', ')} no exists`,
          value: notExistLists,
          path: '_id',
        });
      }

      const newFlashcard = new FlashcardModel({
        forwardText,
        backwardText,
        userID: req.user.id,
      });

      const connectionsWithLists = listIDs.map(listID => ({ flashcardID: newFlashcard.id, listID }));

      await newFlashcard.save();

      await FlashcardsInListsModel.insertMany(connectionsWithLists);

      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  };
}
