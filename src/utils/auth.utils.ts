import { TOKEN_SECRET } from '@/config/env.config';
import jwt from 'jsonwebtoken';

export function generateAccessToken(id: string) {
  const accessToken = jwt.sign({ id }, TOKEN_SECRET ?? '', { expiresIn: 86400 });

  return accessToken;
}
