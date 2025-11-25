import { Router } from 'express';
import { createSubscription, checkPaymentStatus } from '../controllers/paymentController';

const router = Router();

router.post('/subscribe', createSubscription);
router.post('/check-status', checkPaymentStatus);
router.post('/cancel', cancelSubscription); 

export default router;