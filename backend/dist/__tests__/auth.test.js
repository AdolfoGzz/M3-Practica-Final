import request from 'supertest';
import { app } from '../app'; // Adjust this import based on your app structure
describe('Authentication Endpoints', () => {
    describe('POST /api/auth/login', () => {
        it('should return 401 for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
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
});
