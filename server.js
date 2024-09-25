import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/MongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send("Bank-API server is ready.")
})

app.listen(PORT, () => { 
    console.log(`Server started at http://localhost:${PORT}`);
    connectDB();
})