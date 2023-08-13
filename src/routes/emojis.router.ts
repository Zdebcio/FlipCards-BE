import express from 'express';

const router = express.Router();

type EmojiResponse = string[];

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get<{}, EmojiResponse>('/', (req, res) => {
  res.json(['😀', '😳', '🙄']);
});

export default router;
