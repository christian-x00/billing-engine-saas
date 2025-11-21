import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const createProduct = async (req: Request, res: Response) => {
  // 1. Get data from the request
  // tenantId would normally come from the user's login session
  const { tenantId, name, event_name_match, price_cents } = req.body;

  if (!tenantId || !name || !event_name_match || !price_cents) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 2. Create the Product
    const productResult = await supabase
      .from('products')
      .insert([{ tenant_id: tenantId, name, event_name_match }])
      .select()
      .single();

    if (productResult.error) throw productResult.error;
    const product = productResult.data;

    // 3. Create the Price (Linked to the Product)
    const priceResult = await supabase
      .from('prices')
      .insert([{ 
        tenant_id: tenantId, 
        product_id: product.id, 
        type: 'per_unit', // Defaulting to per_unit for MVP
        amount_cents: price_cents 
      }])
      .select()
      .single();

    if (priceResult.error) throw priceResult.error;

    // 4. Return the combined result
    res.status(201).json({ product, price: priceResult.data });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  
  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

  // Fetch products and join their prices
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('tenant_id', tenantId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};