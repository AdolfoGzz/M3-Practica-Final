import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

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
        
        const result = await db.request()
            .input('username', username)
            .query('SELECT * FROM Adolfo WHERE username = @username');
        
        const user = result.recordset[0];
        
        if (!user || !await bcrypt.compare(password, user.password)) {
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
        const result = await db.request().query('SELECT idUser, username FROM Adolfo');
        res.json(result.recordset);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.request()
            .input('id', id)
            .query('SELECT idUser, username FROM Adolfo WHERE idUser = @id');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Get user by id error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await db.request()
            .input('username', username)
            .query('SELECT * FROM Adolfo WHERE username = @username');
        
        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.request()
            .input('username', username)
            .input('password', hashedPassword)
            .query('INSERT INTO Adolfo (username, password) VALUES (@username, @password)');

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
        const existingUser = await db.request()
            .input('id', id)
            .query('SELECT * FROM Adolfo WHERE idUser = @id');
        
        if (existingUser.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if new username is already taken
        if (username) {
            const usernameCheck = await db.request()
                .input('username', username)
                .input('id', id)
                .query('SELECT * FROM Adolfo WHERE username = @username AND idUser != @id');
            
            if (usernameCheck.recordset.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        // Update user
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.request()
                .input('id', id)
                .input('username', username)
                .input('password', hashedPassword)
                .query('UPDATE Adolfo SET username = @username, password = @password WHERE idUser = @id');
        } else {
            await db.request()
                .input('id', id)
                .input('username', username)
                .query('UPDATE Adolfo SET username = @username WHERE idUser = @id');
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
        const existingUser = await db.request()
            .input('id', id)
            .query('SELECT * FROM Adolfo WHERE idUser = @id');
        
        if (existingUser.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        await db.request()
            .input('id', id)
            .query('DELETE FROM Adolfo WHERE idUser = @id');

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