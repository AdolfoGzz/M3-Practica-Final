import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         idUser:
 *           type: integer
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 */

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user.idUser, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user by id error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Registration attempt:', { username, password });
        
        // Check if user already exists
        const existingUser = await User.findByUsername(username);
        
        if (existingUser) {
            console.log('User already exists:', username);
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        await User.create(username, password);

        console.log('User registered successfully:', username);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findById(id);
        
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if new username is already taken
        if (username) {
            const usernameCheck = await User.findByUsername(username);
            if (usernameCheck && usernameCheck.idUser !== parseInt(id)) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        // Update user
        const success = await User.update(id, username, password);
        if (!success) {
            return res.status(500).json({ message: 'Failed to update user' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const existingUser = await User.findById(id);
        
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const success = await User.delete(id);
        if (!success) {
            return res.status(500).json({ message: 'Failed to delete user' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default {
    login,
    getAllUsers,
    getUserById,
    register,
    updateUser,
    deleteUser
}; 