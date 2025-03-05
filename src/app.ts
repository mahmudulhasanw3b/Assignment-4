import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api', router);

// test route
const test = (req: Request, res: Response) => {
    res.send('Course review server is running!');
};
app.get('/', test);

// error
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
