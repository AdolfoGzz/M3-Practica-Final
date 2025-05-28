import request from 'supertest';
import { app } from '../index.js';
import { connectDB, closeDB } from '../config/db.js';
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import User from '../models/user.model.js';

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    // Clean up test data after all tests
    await User.deleteAll();
    await closeDB();
});

beforeEach(async () => {
    // Clean up test data before each test
    await User.deleteAll();
});

describe('Auth Endpoints', () => {
    const testUser = {
        username: `testuser_${Date.now()}`, // Make username unique
        password: 'password123'
    };

    // Register a user once for login tests
    beforeAll(async () => {
        // Ensure a clean state before this specific beforeAll
        await User.deleteAll(); 
        await request(app)
            .post('/api/auth/register')
            .send(testUser);
    });

    it('should register a new user', async () => {
        // Use a different unique username for this test to avoid conflict with the beforeAll user
        const uniqueTestUser = { username: `registertestuser_${Date.now()}`, password: 'password123' };
        const res = await request(app)
            .post('/api/auth/register')
            .send(uniqueTestUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message');
    });

    it('should login with valid credentials', async () => {
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