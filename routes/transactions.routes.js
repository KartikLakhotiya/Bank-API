import express from 'express';
import {
    depositCash,
    transferFunds,
    updateCredit,
    withdraw
} from '../controller/transactions.controller.js';

const router = express.Router();

router.post('/deposit', depositCash)
router.post('/withdraw', withdraw)
router.put('/credit', updateCredit)
router.post('/transfer', transferFunds)

export default router;