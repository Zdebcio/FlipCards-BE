import express from 'express';
import AuthController from '@/controllers/auth.controller';

const router = express.Router();
const auth = new AuthController();

router.post('/login', auth.login);

/**
 * @openapi
 * /user/register:
 *      post:
 *          description: Create new user account
 *          parameters:
 *              schema
 *          responses:
 *              201:
 *                  description: Returns a mysterious string.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              email: string
 *                              password: string
 *              409:
 *                  description: User already exist.
 *              422:
 *                  description: Validation error.
 */
router.post('/register', auth.register);

export default router;