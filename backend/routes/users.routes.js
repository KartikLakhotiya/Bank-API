import express from 'express';
import { checkAuth, createUser, getAllUsers, getUserById, login, logout } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';
import { protectRoute } from '../utils/protectRoute.js';

const router = express.Router();

router.post('/login', login);
router.get('/', getAllUsers);
router.post('/create', createUser);
router.get('/:id', getUserById);
router.post('/logout', verifyToken, logout);
router.get("/v1/check-auth", protectRoute, checkAuth)


export default router;