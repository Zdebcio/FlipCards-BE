import { DB_HOST, DB_PORT, DB_DATABASE } from '@/config/env.config';
import { ConnectOptions } from 'mongoose';

console.log(DB_HOST, DB_PORT, DB_DATABASE);

export const dbConnection = {
  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions,
};
