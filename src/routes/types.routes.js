import express from 'express';
import {
    getAllTypes,
    getCollectionByType,
} from '../services/types.services.js';

const router = express.Router();

router.get('/', getAllTypes);
router.get('/:typeName', getCollectionByType);

export default router;
