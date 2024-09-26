import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/MongoDB.js';
import userRoutes from './routes/users.routes.js';
import accountRoutes from './routes/accounts.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) => {
    res.send("Bank-API server is ready.")
})

// api routes
app.use('/api/users', userRoutes);
app.use('/api/accounts',accountRoutes);


app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    connectDB();
})