import express, { Request, Response, Express, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import itemsRouter from './routes/items.route.ts';
import typesRouter from './routes/types.route.ts';
import ordersRouter from './routes/orders.route.ts';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
dotenv.config();

app.use(
    bodyParser.json({ limit: '30mb', extended: true } as bodyParser.OptionsJson)
);
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    res.send(`Hello to server API. Your IP is: ${ip}`);
});
app.use('/items', itemsRouter);
app.use('/types', typesRouter);
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/orders', ordersRouter);

app.use((err, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

const PORT: string | 5000 = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port: http://localhost:${PORT}`)
);
