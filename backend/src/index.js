const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { connectDB } = require('./config/db');
const userController = require('./controllers/user.controller');
const auth = require('./middleware/auth');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connect to database
connectDB();

// Routes
// Public routes
app.post('/api/auth/login', userController.login);

// Protected routes
app.get('/api/users', auth, userController.getAllUsers);
app.get('/api/users/:id', auth, userController.getUserById);
app.post('/api/users', auth, userController.register);
app.put('/api/users/:id', auth, userController.updateUser);
app.delete('/api/users/:id', auth, userController.deleteUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 