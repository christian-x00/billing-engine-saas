import { Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../config/supabase';

// Helper to generate PayFast signature (Strict Compliance)
const generateSignature = (data: any, passPhrase: string = '') => {
  let pfOutput = '';
  
  // Iterate keys to build the string
  for (let key in data) {
    if(key === 'signature') continue; // Skip signature itself

    if (data.hasOwnProperty(key) && data[key] !== undefined && data[key] !== null && data[key] !== '') {
      // Convert to string and trim whitespace
      const val = String(data[key]).trim();
      // Encode URI components but replace spaces with + (PayFast specific requirement)
      pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}&`;
    }
  }

  // Remove the last ampersand
  let getString = pfOutput.slice(0, -1);

  // Append passphrase if it exists
  if (passPhrase) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }

  // Log the string for debugging (Be careful with secrets in prod logs)
  // console.log('Signature String:', getString);

  return crypto.createHash('md5').update(getString).digest('hex');
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { tenantId, email, amount, planName } = req.body;
    
    if (!process.env.PAYFAST_MERCHANT_ID || !process.env.PAYFAST_MERCHANT_KEY) {
      throw new Error('PayFast credentials missing in Backend');
    }

    const amountStr = Number(amount).toFixed(2);

    // --- THE 14-DAY TRIAL LOGIC ---
    const today = new Date();
    const trialEnd = new Date(today);
    trialEnd.setDate(today.getDate() + 14); // Add 14 days
    const billingDate = trialEnd.toISOString().split('T')[0]; // YYYY-MM-DD
    // ------------------------------

    const data: any = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.FRONTEND_URL}/settings?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/settings?cancel=true`,
      
      name_first: 'Client',
      email_address: email,
      m_payment_id: tenantId,
      amount: amountStr,
      item_name: `Subscription: ${planName} (14-Day Trial)`, // Updated Name
      
      subscription_type: '1',
      billing_date: billingDate, // Charge happens in 2 weeks
      recurring_amount: amountStr,
      frequency: '3', // Monthly
      cycles: '0'
    };

    if (process.env.PAYFAST_PASSPHRASE) {
        data.signature = generateSignature(data, process.env.PAYFAST_PASSPHRASE);
    } else {
        data.signature = generateSignature(data);
    }

    const queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');
    res.json({ url: `${process.env.PAYFAST_URL}?${queryString}` });

  } catch (error: any) {
    console.error('PAYMENT ERROR:', error);
    res.status(500).json({ error: 'Payment Init Failed', details: error.message });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
    // This endpoint is called by the Frontend after a successful return
    const { tenantId } = req.body;
    
    if (!tenantId) return res.status(400).json({ error: 'Tenant ID missing' });

    // Determine plan name based on payment amount or context if needed.
    // For MVP, we assume "Standard" if not specified, or update generic "Active"
    // In a real app, you might want to pass the plan name in the query param too.
    
    // Update Database to Active
    const { error } = await supabase
        .from('tenants')
        .update({ 
            subscription_status: 'active',
            // We set a generic active status here. 
            // Ideally, you'd fetch the specific plan from a pending_payments table.
            subscription_plan: 'Standard (Active)' 
        })
        .eq('id', tenantId);

    if (error) {
        console.error('DB Error:', error);
        return res.status(500).json({ error: 'DB Update Failed' });
    }
    
    res.json({ status: 'active', message: 'Subscription activated successfully' });
};

// ITN Handler (Webhook) - Kept for reference if you fix the URL blocking later
export const handleITN = async (req: Request, res: Response) => {
  const pfData = req.body;
  console.log('ITN Received:', pfData);

  if(pfData.payment_status === 'COMPLETE') {
      const tenantId = pfData.m_payment_id;
      await supabase.from('tenants').update({ subscription_status: 'active' }).eq('id', tenantId);
  }
  res.status(200).send();
};