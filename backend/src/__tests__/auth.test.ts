import request from 'supertest';
import { app } from '../index.js';
import { connectDB } from '../config/db.js';
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import User from '../models/user.model.js';

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
    // Clean up test data before each test
    await User.deleteAll();
});

afterAll(async () => {
    // Clean up test data after all tests
    await User.deleteAll();
});

describe('Auth Endpoints', () => {
    const testUser = {
        username: `testuser_${Date.now()}`, // Make username unique
        password: 'password123'
    };

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message');
    });

    it('should login with valid credentials', async () => {
        // First register the user
        await request(app)
            .post('/api/auth/register')
            .send(testUser);

        // Then try to login
        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: testUser.username,
                password: 'wrongpassword'
            });
        expect(response.status).toBe(401);
    });

    it('should return 400 for missing credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({});
        expect(response.status).toBe(400);
    });
}); 