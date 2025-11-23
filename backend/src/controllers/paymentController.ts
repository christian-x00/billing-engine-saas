import { Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../config/supabase';

const generateSignature = (data: any, passPhrase: string = '') => {
  let pfOutput = '';
  for (let key in data) {
    if(key === 'signature') continue;
    if (data.hasOwnProperty(key) && data[key] !== undefined && data[key] !== null && data[key] !== '') {
      const val = String(data[key]).trim();
      pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}&`;
    }
  }
  let getString = pfOutput.slice(0, -1);
  if (passPhrase) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }
  return crypto.createHash('md5').update(getString).digest('hex');
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { tenantId, email, amount, planName } = req.body;
    
    // 1. Prepare PayFast Data (No Notify URL to avoid Sandbox blocks)
    const data: any = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.FRONTEND_URL}/settings?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/settings?cancel=true`,
      // notify_url: Removed to prevent Render URL blocking
      
      name_first: 'Client',
      email_address: email,
      m_payment_id: tenantId,
      amount: Number(amount).toFixed(2),
      item_name: `Subscription: ${planName}`,
    };

    // 2. Sign
    data.signature = generateSignature(data, process.env.PAYFAST_PASSPHRASE);

    // 3. Return URL
    const queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');
    const redirectUrl = `${process.env.PAYFAST_URL}?${queryString}`;

    res.json({ url: redirectUrl });

  } catch (error: any) {
    console.error('PAYMENT ERROR:', error);
    res.status(500).json({ error: 'Payment Init Failed' });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
    // Called by Frontend after successful return
    const { tenantId } = req.body;
    
    if (!tenantId) return res.status(400).json({ error: 'Tenant ID missing' });

    // Update Database to Active
    const { error } = await supabase
        .from('tenants')
        .update({ 
            subscription_status: 'active',
            subscription_plan: 'Startup Plan (Active)' 
        })
        .eq('id', tenantId);

    if (error) {
        console.error('DB Error:', error);
        return res.status(500).json({ error: 'DB Update Failed' });
    }
    
    res.json({ status: 'active', message: 'Subscription activated successfully' });
};