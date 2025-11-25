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
    
    if (!process.env.PAYFAST_MERCHANT_ID || !process.env.PAYFAST_MERCHANT_KEY) {
      throw new Error('PayFast credentials missing in Backend');
    }

    const amountStr = Number(amount).toFixed(2);

    // 14-Day Trial Logic
    const today = new Date();
    const trialEnd = new Date(today);
    trialEnd.setDate(today.getDate() + 14); 
    const billingDate = trialEnd.toISOString().split('T')[0];

    const data: any = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.FRONTEND_URL}/settings?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/settings?cancel=true`,
      
      name_first: 'Client',
      email_address: email,
      m_payment_id: tenantId,
      amount: amountStr,
      item_name: `Subscription: ${planName} (14-Day Trial)`,
      
      subscription_type: '1',
      billing_date: billingDate,
      recurring_amount: amountStr,
      frequency: '3',
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
    const { tenantId, planName } = req.body;
    
    if (!tenantId) return res.status(400).json({ error: 'Tenant ID missing' });

    // Calculate Period End (30 Days + 14 Trial = 44 Days or just 30)
    // Let's assume 30 days cycle start immediately upon activation for logic simplicity
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
    
    // Mark as canceled (access remains until period_end)
    const { error } = await supabase
        .from('tenants')
        .update({ subscription_status: 'canceled' })
        .eq('id', tenantId);

    if (error) return res.status(500).json({ error: 'Cancel Failed' });
    res.json({ status: 'canceled' });
};