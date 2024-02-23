import FlashcardsController from '@/controllers/flashcards.controller';
import express from 'express';

const router = express.Router();
const flashcards = new FlashcardsController();

router.get('/', flashcards.getFlashcards);

router.post('/create', flashcards.create);

router.delete('/delete/list/:listID/flashcard/:flashcardID', flashcards.delete);

export default router;
