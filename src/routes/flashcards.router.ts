import FlashcardsController from '@/controllers/flashcards.controller';
import express from 'express';

const router = express.Router();
const flashcards = new FlashcardsController();

router.get('/', flashcards.getFlashcards);

router.post('/create', flashcards.create);

export default router;
