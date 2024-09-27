import express from 'express';
import {  getAccountById, getAllAccounts } from '../controller/accounts.controller.js';

const router = express.Router();

router.get('/all', getAllAccounts)
// router.post('/createacc', createAccount);
router.get('/:id', getAccountById);

export default router;