import { Router } from 'express';
import { createApiKey } from '../controllers/apiKeyController';

const router = Router();

// POST http://localhost:4000/api/keys
router.post('/', createApiKey);

export default router;