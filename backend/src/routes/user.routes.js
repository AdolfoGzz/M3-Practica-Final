import express from 'express';
import userController from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, userController.register);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

export default router; 