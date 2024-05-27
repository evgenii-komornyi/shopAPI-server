import express from 'express';
import { getAllItems, getItemById } from '../services/items.service';

const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);

export default router;
