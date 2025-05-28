import request from 'supertest';
import { app } from '../index.js';
import { connectDB, closeDB } from '../config/db.js';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import User from '../models/user.model.js';

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    // Clean up test data after all tests (optional, nested afterAll handles main cleanup)
    await User.deleteAll(); 
    await closeDB();
});

describe('Auth Endpoints', () => {
    const testUser = {
        username: `testuser_${Date.now()}`, // Make username unique
        password: 'password123'
    };

    // Register a user once before login tests and clean up after this block
    beforeAll(async () => {
        // Ensure a clean state before starting tests in this block
        await User.deleteAll();
        // Register the user needed for login tests
        await request(app)
            .post('/api/auth/register')
            .send(testUser);
    });

    afterAll(async () => {
        // Clean up users created in this describe block
        await User.deleteAll();
    });

    it('should register a new user', async () => {
        // Use a different unique username for this test to avoid conflict
        const uniqueTestUser = { username: `registertestuser_${Date.now()}`, password: 'password123' };
        const res = await request(app)
            .post('/api/auth/register')
            .send(uniqueTestUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message');
        // No explicit cleanup needed here, nested afterAll will handle it
    });

    it('should login with valid credentials', async () => {
        // The user was registered in the nested beforeAll
        // Add a small delay to ensure database consistency
        await new Promise(resolve => setTimeout(resolve, 200)); // Add a delay here

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