import { Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../config/supabase';

// Helper: Generate PayFast Signature
const generateSignature = (data: any, passPhrase: string = '') => {
  const cleanData: any = {};
  
  for (let key in data) {
    if (key !== 'signature' && data[key] !== undefined && data[key] !== null && data[key] !== '') {
      cleanData[key] = String(data[key]).trim();
    }
  }

  let queryString = new URLSearchParams(cleanData).toString();

  if (passPhrase) {
    queryString += `&passphrase=${encodeURIComponent(passPhrase.trim())}`;
  }

  return crypto.createHash('md5').update(queryString).digest('hex');
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    console.log('--- Starting Payment Initialization ---');
    const { tenantId, email, amount, planName } = req.body; // amount is in USD (e.g., 100)
    
    if (!process.env.PAYFAST_MERCHANT_ID || !process.env.PAYFAST_MERCHANT_KEY) {
      throw new Error('PayFast credentials missing in Backend');
    }

    // --- CURRENCY CONVERSION (USD -> ZAR) ---
    // PayFast requires ZAR. We assume $1 = R19.00 for this implementation.
    const EXCHANGE_RATE = 19.00; 
    const amountZAR = (Number(amount) * EXCHANGE_RATE).toFixed(2);
    
    console.log(`Converting $${amount} to R${amountZAR}`);

    // 14-Day Trial Logic
    const today = new Date();
    const trialEnd = new Date(today);
    trialEnd.setDate(today.getDate() + 14); 
    const billingDate = trialEnd.toISOString().split('T')[0];

    // 1. Prepare Data
    const data: any = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.FRONTEND_URL}/settings?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/settings?cancel=true`,
      
      name_first: 'Client',
      email_address: email,
      m_payment_id: tenantId,
      amount: amountZAR, // Send ZAR amount
      item_name: `Subscription: ${planName} ($${amount}/mo)`, // Display USD price in name
      
      subscription_type: '1',
      billing_date: billingDate,
      recurring_amount: amountZAR, // Recurring in ZAR
      frequency: '3',
      cycles: '0'
    };

    // 2. Generate Signature
    if (process.env.PAYFAST_PASSPHRASE) {
        data.signature = generateSignature(data, process.env.PAYFAST_PASSPHRASE);
    } else {
        data.signature = generateSignature(data);
    }

    // 3. Build Final URL
    const params = new URLSearchParams();
    for (let key in data) {
        if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
            params.append(key, String(data[key]).trim());
        }
    }

    const redirectUrl = `${process.env.PAYFAST_URL}?${params.toString()}`;
    res.json({ url: redirectUrl });

  } catch (error: any) {
    console.error('PAYMENT ERROR:', error);
    res.status(500).json({ error: 'Payment Init Failed', details: error.message });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
    const { tenantId, planName } = req.body;
    
    if (!tenantId) return res.status(400).json({ error: 'Tenant ID missing' });

    // Calculate Period End (30 Days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const { error } = await supabase
        .from('tenants')
        .update({ 
            subscription_status: 'active',
            subscription_plan: planName || 'Standard',
            current_period_end: endDate.toISOString()
        })
        .eq('id', tenantId);

    if (error) {
        console.error('DB Error:', error);
        return res.status(500).json({ error: 'DB Update Failed' });
    }
    
    res.json({ status: 'active', message: 'Subscription activated successfully' });
};

export const cancelSubscription = async (req: Request, res: Response) => {
    const { tenantId } = req.body;
    
    const { error } = await supabase
        .from('tenants')
        .update({ subscription_status: 'canceled' })
        .eq('id', tenantId);

    if (error) return res.status(500).json({ error: 'Cancel Failed' });
    res.json({ status: 'canceled' });
};