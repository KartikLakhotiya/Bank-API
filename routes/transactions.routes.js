import express from 'express';
import { depositCash, withdraw } from '../controller/transactions.controller.js';

const router = express.Router();

router.post('/deposit', depositCash)
router.post('/withdraw', withdraw)

export default router;