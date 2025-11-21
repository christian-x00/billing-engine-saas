import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    console.log("1. Starting Aggregation...")
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch Products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, event_name_match, tenant_id')
    
    if (prodError) {
      console.error("Error fetching products:", prodError)
      throw prodError
    }
    console.log(`2. Found ${products?.length} products`)

    // 3. Fetch Events
    const { data: events, error: eventError } = await supabase
      .from('events')
      .select('*')
      .limit(100)
    
    if (eventError) {
      console.error("Error fetching events:", eventError)
      throw eventError
    }
    console.log(`3. Found ${events?.length} events`)

    if (!events || events.length === 0) {
      console.log("No events found. Exiting.")
      return new Response(JSON.stringify({ message: "No events" }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. Match Logic
    const groups: any = {}
    let matchCount = 0

    for (const event of events) {
      console.log(`Processing Event: ${event.event_name} for Tenant: ${event.tenant_id}`)
      
      // Find matching product
      const product = products?.find(p => 
        p.tenant_id === event.tenant_id && 
        p.event_name_match === event.event_name
      )

      if (product) {
        console.log(`  -> MATCH FOUND! Product ID: ${product.id}`)
        matchCount++
        const key = `${event.tenant_id}_${event.customer_id}_${product.id}`
        if (!groups[key]) {
          groups[key] = {
            tenant_id: event.tenant_id,
            customer_id: event.customer_id,
            product_id: product.id,
            count: 0
          }
        }
        groups[key].count += 1
      } else {
        console.log(`  -> NO MATCH. Expected tenant ${event.tenant_id} and name ${event.event_name}`)
      }
    }

    const updates = Object.values(groups).map((g: any) => ({
      tenant_id: g.tenant_id,
      customer_id: g.customer_id,
      product_id: g.product_id,
      usage_count: g.count,
      date: new Date().toISOString().split('T')[0],
      amount_cents: 0 
    }))

    console.log(`4. Preparing to insert ${updates.length} rows into usage_aggregates`)

    if (updates.length > 0) {
      const { error: insertError } = await supabase
        .from('usage_aggregates')
        .upsert(updates, { onConflict: 'tenant_id, customer_id, product_id, date' })
      
      if (insertError) {
        console.error("INSERT ERROR:", insertError)
        throw insertError
      }
      console.log("5. Insert Successful")
    }

    return new Response(
      JSON.stringify({ success: true, processed: events.length, matches: matchCount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )

  } catch (err: any) {
    console.error("CRITICAL ERROR:", err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})