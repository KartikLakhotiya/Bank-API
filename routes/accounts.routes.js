import express from 'express';
import { createAccount, getAccountById } from '../controller/accounts.controller.js';

const router = express.Router();

router.post('/createacc', createAccount);
router.get('/:id', getAccountById);

export default router;