import express from 'express';
import { verifyToken } from '@/middlewares';

import auth from './auth.router';
import list from './list.router';

const router = express.Router();

router.use('/auth', auth);
router.use('/list', verifyToken, list);

export default router;
