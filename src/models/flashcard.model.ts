import { Flashcard } from '@/interfaces/Flashcard.interface';
import { Schema, model } from 'mongoose';

const flashcardSchema = new Schema(
  {
    forwardText: {
      type: String,
      required: true,
    },
    backwardText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const FlashcardModel = model<Flashcard & Document>('FlashCard', flashcardSchema);

export default FlashcardModel;
