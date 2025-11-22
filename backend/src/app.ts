import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import Routes
import apiKeyRoutes from './routes/apiKeyRoutes';
import eventRoutes from './routes/eventRoutes';
import productRoutes from './routes/productRoutes';
import paymentRoutes from './routes/paymentRoutes'; // Ensure this file exists

dotenv.config();

const app = express();

// --- 1. SECURITY & MIDDLEWARE ---
app.use(helmet());
app.use(morgan('combined')); // 'combined' gives more detailed logs than 'dev'
app.use(express.json());

// --- 2. CORS CONFIGURATION (Crucial for Vercel -> Render communication) ---
// We allow localhost (for dev) and your specific Vercel domain
const allowedOrigins = [
  'http://localhost:3000',
  'https://billing-engine.vercel.app', // <--- MAKE SURE THIS MATCHES YOUR VERCEL URL EXACTLY
  'https://billing-engine-api.vercel.app', // Adding your other potential domain just in case
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`); // Log blocked origins for debugging
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// --- 3. ROUTES ---
app.use('/api/keys', apiKeyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

// Health Check
app.get('/', (req, res) => {
  res.status(200).send('Billing Engine API is Healthy 🚀');
});

// --- 4. ERROR HANDLING ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

// --- 5. START SERVER ---
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Startup Check: Warn if PayFast keys are missing
  if (!process.env.PAYFAST_MERCHANT_ID || !process.env.PAYFAST_MERCHANT_KEY) {
    console.warn('⚠️  WARNING: PayFast credentials are missing in Environment Variables!');
  } else {
    console.log('✅ PayFast credentials loaded.');
  }
});

export default app;