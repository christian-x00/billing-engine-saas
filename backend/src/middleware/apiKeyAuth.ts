import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { hashApiKey } from '../utils/apiKey';

// Extend Express Request to include the found tenant
export interface AuthRequest extends Request {
  tenantId?: string;
}

export const validateApiKey = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Get key from headers
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing x-api-key header' });
  }

  try {
    // 2. Hash the incoming key so we can look it up
    const hashedKey = hashApiKey(apiKey);

    // 3. Check Database
    const { data, error } = await supabase
      .from('api_keys')
      .select('tenant_id')
      .eq('key_hash', hashedKey)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: 'Invalid API Key' });
    }

    // 4. Attach Tenant ID to the request so the controller knows who this is
    req.tenantId = data.tenant_id;
    next(); // Proceed to the next step

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};