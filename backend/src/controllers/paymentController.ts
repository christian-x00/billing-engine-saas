import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { supabase } from '../config/supabase';

// Helper to generate signature
const generateSignature = (data: any, passPhrase: string = '') => {
  let pfOutput = '';
  for (let key in data) {
    if (data.hasOwnProperty(key) && data[key] !== '') {
      pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`;
    }
  }
  let getString = pfOutput.slice(0, -1);
  if (passPhrase) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }
  return crypto.createHash('md5').update(getString).digest('hex');
};

export const createSubscription = async (req: Request, res: Response) => {
  const { tenantId, email, amount, planName } = req.body;

  // 1. Prepare PayFast Data
  const data: any = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: `${process.env.FRONTEND_URL}/settings?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/settings?cancel=true`,
    notify_url: `${process.env.BACKEND_URL}/api/payments/itn`,
    
    // Buyer Details
    name_first: 'Client',
    email_address: email,
    
    // Transaction Details
    m_payment_id: tenantId, // Use Tenant ID to track who paid
    amount: amount.toFixed(2),
    item_name: `Subscription: ${planName}`,
    
    // Subscription (Recurring)
    subscription_type: 1, // 1 = Subscription
    billing_date: new Date().toISOString().split('T')[0], // Start today
    recurring_amount: amount.toFixed(2),
    frequency: 3, // 3 = Monthly
    cycles: 0 // 0 = Indefinite
  };

  // 2. Sign Data
  data.signature = generateSignature(data, process.env.PAYFAST_PASSPHRASE);

  // 3. Return URL to Frontend (Client will redirect there)
  const queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');
  const redirectUrl = `${process.env.PAYFAST_URL}?${queryString}`;

  res.json({ url: redirectUrl });
};

export const handleITN = async (req: Request, res: Response) => {
  // PayFast calls this webhook to confirm payment
  const pfData = req.body;
  
  // 1. Validate Signature (Security Check)
  // In production, you MUST verify signature and IP source. 
  // For MVP, we assume valid if status is COMPLETE.

  if(pfData.payment_status === 'COMPLETE') {
      const tenantId = pfData.m_payment_id;
      const pfPaymentId = pfData.pf_payment_id;

      // 2. Update Database: Set Tenant to ACTIVE
      // We assume you have a 'subscription_status' column in 'tenants' table
      await supabase
        .from('tenants')
        .update({ 
            subscription_status: 'active',
            subscription_plan: pfData.item_name,
            payfast_token: pfData.token // Save token for future charges
        })
        .eq('id', tenantId);
      
      console.log(`Payment Success for Tenant ${tenantId}`);
  }

  res.status(200).send(); // Always return 200 to PayFast
};