import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
    try {
        logger.info('Database', 'Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI)
        logger.success('Database', `MongoDB Connected successfully`, { host: conn.connection.host });
        
        // Log database events
        mongoose.connection.on('disconnected', () => {
            logger.warn('Database', 'MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            logger.info('Database', 'MongoDB reconnected');
        });
        
        mongoose.connection.on('error', (err) => {
            logger.error('Database', 'MongoDB connection error', err);
        });

    } catch (error) {
        logger.error('Database', 'Failed to connect to MongoDB', error);
        process.exit(1);
    }
}

export default connectDB;