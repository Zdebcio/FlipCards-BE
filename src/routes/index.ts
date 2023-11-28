import express from 'express';
import { verifyToken } from '@/middlewares';

import auth from './auth.router';
import lists from './lists.router';
import flashcards from './flashcards.router';

const router = express.Router();

router.use('/auth', auth);
router.use('/lists', verifyToken, lists);
router.use('/flashcards', verifyToken, flashcards);

export default router;
