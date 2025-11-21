import { Router } from 'express';
import { recordEvent } from '../controllers/eventController';
import { validateApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// POST http://localhost:4000/api/events
// The 'validateApiKey' middleware runs first!
router.post('/', validateApiKey, recordEvent);

export default router;