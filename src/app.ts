import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

import * as middlewares from './middlewares';
import api from './routes';
import initializeSwagger from './config/swagger.config';
import { dbConnection } from './db';

const app = express();

mongoose.connect(dbConnection.url, dbConnection.options);

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', api);

initializeSwagger(app);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
