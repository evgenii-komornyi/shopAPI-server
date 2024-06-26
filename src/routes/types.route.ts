import express from 'express';
import { getAllTypes, getCollectionByType } from '../services/types.service.ts';

const router = express.Router();

router.get('/', getAllTypes);
router.get('/:typeName', getCollectionByType);

export default router;
