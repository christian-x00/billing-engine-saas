import { Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../config/supabase';

// Helper to generate signature (Strict PayFast compliance)
const generateSignature = (data: any, passPhrase: string = '') => {
  let pfOutput = '';
  
  for (let key in data) {
    // Skip signature if it's already in the object to prevent recursion
    if(key === 'signature') continue;

    if (data.hasOwnProperty(key) && data[key] !== undefined && data[key] !== null && data[key] !== '') {
      // Convert to string and trim
      const val = String(data[key]).trim();
      // Use encodeURIComponent but replace spaces with + (PayFast requirement)
      pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}&`;
    }
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);

  if (passPhrase) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }

  console.log('Signature String:', getString); // Debug Log

  return crypto.createHash('md5').update(getString).digest('hex');
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    console.log('--- Starting Payment Initialization ---');
    const { tenantId, email, amount, planName } = req.body;
    
    // Check credentials
    if (!process.env.PAYFAST_MERCHANT_ID || !process.env.PAYFAST_MERCHANT_KEY) {
      throw new Error('PayFast credentials missing in Backend Environment Variables');
    }

    // Ensure amount is formatted correctly (e.g., "100.00")
    const amountStr = Number(amount).toFixed(2);

    // 1. Prepare PayFast Data
    // IMPORTANT: All values should be strings/numbers. No nested objects.
    const data: any = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.FRONTEND_URL}/settings?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/settings?cancel=true`,
     // notify_url: `${process.env.BACKEND_URL}/api/payments/itn`,
      
      name_first: 'Client',
      email_address: email,
      m_payment_id: tenantId,
      amount: amountStr,
      item_name: `Subscription: ${planName}`,
      
      // Subscription Fields (Send as strings to be safe)
      subscription_type: '1', // 1 = Subscription
      billing_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      recurring_amount: amountStr,
      frequency: '3', // 3 = Monthly
      cycles: '0'     // 0 = Indefinite
    };

    // 2. Sign Data
    if (process.env.PAYFAST_PASSPHRASE) {
        data.signature = generateSignature(data, process.env.PAYFAST_PASSPHRASE);
    } else {
        data.signature = generateSignature(data);
    }

    console.log('Final Data Payload:', data);

    // 3. Return URL
    const queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');
    const redirectUrl = `${process.env.PAYFAST_URL}?${queryString}`;

    res.json({ url: redirectUrl });

  } catch (error: any) {
    console.error('PAYMENT CRASH:', error.message);
    res.status(500).json({ error: 'Payment Init Failed', details: error.message });
  }
};

export const handleITN = async (req: Request, res: Response) => {
  // PayFast calls this webhook to confirm payment
  // In production, verify the signature here!
  
  const pfData = req.body;
  console.log('ITN Received:', pfData);

  if(pfData.payment_status === 'COMPLETE') {
      const tenantId = pfData.m_payment_id;

      // Update Database
      await supabase
        .from('tenants')
        .update({ 
            subscription_status: 'active',
            subscription_plan: pfData.item_name,
            payfast_token: pfData.token
        })
        .eq('id', tenantId);
      
      console.log(`Subscription Activated for Tenant ${tenantId}`);
  }

  res.status(200).send();
};