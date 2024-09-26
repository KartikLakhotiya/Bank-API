import express from 'express';
import { createUser, getAllUsers, getUserById } from '../controller/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/create', createUser);
router.get('/:id', getUserById);

export default router;