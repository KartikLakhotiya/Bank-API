import express from 'express';
import { createUser, getAllUsers, getUserById, login, logout } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/login', login);
router.get('/', getAllUsers);
router.post('/create', createUser);
router.get('/:id', getUserById);
router.post('/logout', verifyToken, logout);


export default router;