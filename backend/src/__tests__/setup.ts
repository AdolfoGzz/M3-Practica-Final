import dotenv from 'dotenv';
import { beforeAll, afterAll } from '@jest/globals';

// Load environment variables from .env.test if it exists, otherwise from .env
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Configure test database connection
export const testDbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrong!Passw0rd',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'test_db',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Global setup for tests
beforeAll(async () => {
  // Add any global setup here
});

// Global teardown for tests
afterAll(async () => {
  // Add any global cleanup here
}); 