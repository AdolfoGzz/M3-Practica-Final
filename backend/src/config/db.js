import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true
    }
};

export const db = new sql.ConnectionPool(config);

export const connectDB = async () => {
    try {
        await db.connect();
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export const closeDB = async () => {
    try {
        await db.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Database closing error:', error);
    }
}; 