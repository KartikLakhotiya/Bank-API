import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/MongoDB.js';
import userRoutes from './routes/users.routes.js';
import accountRoutes from './routes/accounts.routes.js';
import transactionRoutes from './routes/transactions.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from './utils/logger.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000


// Request logging middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.request(req.method, req.originalUrl, res.statusCode, duration);
    });
    
    next();
});

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

logger.info('Server', 'Middlewares initialized successfully');

app.get('/', (req, res) => {
    logger.info('Server', 'Health check endpoint accessed');
    res.send("Bank-API server is ready.")
})

// api routes
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

logger.info('Server', 'API routes registered', { 
    routes: ['/api/users', '/api/accounts', '/api/transactions'] 
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Server', 'Unhandled error occurred', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
    logger.warn('Server', `Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    logger.success('Server', `Server started successfully at http://localhost:${PORT}`);
    logger.info('Server', `Environment: ${process.env.NODE_ENV || 'development'}`);
    connectDB();
})