import { config } from 'dotenv';

config();

export const { NODE_ENV, PORT } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
