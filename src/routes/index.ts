import express from 'express';

import auth from './auth.router';
import list from './list.router';

const router = express.Router();

router.use('/auth', auth);
router.use('/list', list);

export default router;
