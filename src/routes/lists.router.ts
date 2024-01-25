import express from 'express';
import ListsController from '@/controllers/lists.controller';

const router = express.Router();
const lists = new ListsController();

router.post('/create', lists.create);

router.get('/user-lists', lists.getUserLists);
router.get('/:listID', lists.getList);

export default router;
