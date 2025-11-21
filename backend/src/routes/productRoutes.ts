import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/productController';

const router = Router();

// POST /api/products (Create)
router.post('/', createProduct);

// GET /api/products?tenantId=... (List)
router.get('/', getProducts);

export default router;