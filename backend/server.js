import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import productRoutes from './routes/productRoutes.js'; // Route definitions for products

const port = process.env.PORT || 5001;
const app = express();

app.use('/api/products', productRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
