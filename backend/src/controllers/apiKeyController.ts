import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { generateApiKey, hashApiKey } from '../utils/apiKey';

export const createApiKey = async (req: Request, res: Response) => {
  const { tenantId } = req.body; // In a real app, we get this from the logged-in user's session

  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID is required' });
  }

  try {
    // 1. Generate the key
    const rawKey = generateApiKey();
    const hashedKey = hashApiKey(rawKey);

    // 2. Store the Hash in the DB
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          tenant_id: tenantId,
          key_hash: hashedKey,
          prefix: 'sk_live', // We store the prefix to help identify keys in UI
        },
      ])
      .select();

    if (error) throw error;

    // 3. Return the RAW key to the user (Only time they will see it!)
    res.status(201).json({
      message: 'API Key created successfully',
      apiKey: rawKey, // vital: send back the raw key
      id: data[0].id
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};