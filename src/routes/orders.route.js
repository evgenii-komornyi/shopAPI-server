import express from 'express';
import { createOrder, getOrderById } from '../services/orders.service.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/:clientId/:orderId', getOrderById);

export default router;
