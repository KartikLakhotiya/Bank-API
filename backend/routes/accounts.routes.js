import express from 'express';
import { checkBalance, getAccountById, getAllAccounts } from '../controller/accounts.controller.js';

const router = express.Router();

router.get('/all', getAllAccounts)
// router.post('/createacc', createAccount);
router.get('/:id', getAccountById);
router.post('/check-balance', checkBalance);


export default router;