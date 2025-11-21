import productRoutes from './routes/productRoutes';
import eventRoutes from './routes/eventRoutes';
import apiKeyRoutes from './routes/apiKeyRoutes';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/keys', apiKeyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/products', productRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Usage Billing Engine API is running 🚀');
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});