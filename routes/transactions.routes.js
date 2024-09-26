import express from 'express';
import { depositCash } from '../controller/transactions.controller.js';

const router = express.Router();

router.post('/deposit', depositCash)

export default router;