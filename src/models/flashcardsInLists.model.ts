import { FlashcardsInLists } from '@/interfaces/FlashcardsInLists.interface';
import { Schema, model } from 'mongoose';

const flashcardsInListsSchema = new Schema(
  {
    flashcardID: {
      type: Schema.ObjectId,
      required: true,
    },
    listID: {
      type: Schema.ObjectId,
      required: true,
    },
    userID: {
      type: Schema.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

const FlashcardsInListsModel = model<FlashcardsInLists & Document>('FlashcardsInLists', flashcardsInListsSchema);

export default FlashcardsInListsModel;
