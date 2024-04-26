import express from 'express';
import { getAllFish, getFishById } from '../services/fish.services.js';

const router = express.Router();

router.get('/', getAllFish);
router.get('/:id', getFishById);

export default router;
