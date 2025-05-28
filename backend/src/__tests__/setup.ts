import dotenv from 'dotenv';

// Load environment variables from .env.test if it exists, otherwise from .env
dotenv.config({ path: '.env.test' });
 
// Set test environment
process.env.NODE_ENV = 'test'; 