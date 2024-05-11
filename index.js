import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import itemsRouter from './src/routes/items.route.js';
import typesRouter from './src/routes/types.route.js';
import ordersRouter from './src/routes/orders.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    const ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    res.send(`Hello to server API. Your IP is: ${ip}`);
});
app.use('/items', itemsRouter);
app.use('/types', typesRouter);
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/orders', ordersRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port: http://localhost:${PORT}`)
);
