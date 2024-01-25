import express from 'express';
import ListsController from '@/controllers/lists.controller';

const router = express.Router();
const lists = new ListsController();

router.get('/', lists.getLists);
router.get('/:listID', lists.getList);

router.post('/create', lists.create);

export default router;
