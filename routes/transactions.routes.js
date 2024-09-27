import express from 'express';
import {
    depositCash,
    getUsersTransaction,
    transferFunds,
    updateCredit,
    withdraw
} from '../controller/transactions.controller.js';

const router = express.Router();

router.post('/deposit', depositCash)
router.post('/withdraw', withdraw)
router.put('/credit', updateCredit)
router.post('/transfer', transferFunds)
router.get('/user/:id', getUsersTransaction)

export default router;