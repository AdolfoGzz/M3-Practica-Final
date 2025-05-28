import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/user.routes.js';
import specs from './config/swagger.js';
import { connectDB } from './config/db.js';
import userController from './controllers/user.controller.js';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
// Public routes
app.post('/api/auth/login', userController.login);

// Protected routes
app.get('/api/users', auth, userController.getAllUsers);
app.get('/api/users/:id', auth, userController.getUserById);
app.post('/api/users', auth, userController.register);
app.put('/api/users/:id', auth, userController.updateUser);
app.delete('/api/users/:id', auth, userController.deleteUser);

app.use('/api/users', userRoutes);

// Connect to database
connectDB();

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
  });
}

export { app }; 