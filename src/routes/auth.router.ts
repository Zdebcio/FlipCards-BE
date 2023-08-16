import express from 'express';
import AuthController from '@/controllers/auth.controller';

const router = express.Router();
const auth = new AuthController();

router.post('/login', auth.login);

router.post('/register', auth.register);

export default router;
