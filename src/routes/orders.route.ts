import { Router } from 'express';
import { createOrder, getOrderById } from '../services/orders.service.ts';

const router: Router = Router();

router.post('/', createOrder);
router.get('/:clientId/:orderId', getOrderById);

export default router;
