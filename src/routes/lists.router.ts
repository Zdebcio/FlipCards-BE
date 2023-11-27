import express from 'express';
import ListsController from '@/controllers/lists.controller';

const router = express.Router();
const list = new ListsController();

router.post('/create', list.create);

router.get('/user-lists', list.getUserLists);

export default router;
