import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/apiKeyAuth';

export const recordEvent = async (req: AuthRequest, res: Response) => {
  // 1. Get data from body
  const { customer_id, event_name, properties } = req.body;
  const tenantId = req.tenantId; // This came from our Middleware

  if (!customer_id || !event_name) {
    return res.status(400).json({ error: 'Missing customer_id or event_name' });
  }

  try {
    // 2. Insert into Supabase
    const { error } = await supabase
      .from('events')
      .insert([
        {
          tenant_id: tenantId,
          customer_id: customer_id,
          event_name: event_name,
          properties: properties || {},
          idempotency_key: req.headers['x-idempotency-key'] || null 
        }
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      // Usually this happens if customer_id doesn't exist
      return res.status(400).json({ error: 'Could not record event. Check if customer_id exists.' });
    }

    // 3. Success
    res.status(200).json({ status: 'recorded' });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};