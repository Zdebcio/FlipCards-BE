import express from 'express';
import ListController from '@/controllers/list.controller';

const router = express.Router();
const list = new ListController();

router.post('/create', list.create);

export default router;
