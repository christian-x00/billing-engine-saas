import { Router } from 'express';
import { createSubscription, handleITN } from '../controllers/paymentController';

const router = Router();

router.post('/subscribe', createSubscription);
router.post('/itn', handleITN); // Webhook

export default router;