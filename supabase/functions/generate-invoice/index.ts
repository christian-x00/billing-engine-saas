import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { tenant_id, customer_id } = await req.json()
    if (!tenant_id || !customer_id) throw new Error("Missing IDs")

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch Usage (No Joins yet)
    const { data: usage, error: usageError } = await supabase
      .from('usage_aggregates')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('customer_id', customer_id)
    
    if (usageError) throw usageError
    if (!usage || usage.length === 0) throw new Error("No usage found to bill")

    // 2. Manual Fetch of Products and Prices (Avoids Relationship Errors)
    const productIds = usage.map((u: any) => u.product_id)
    
    // Get Product Names
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds)

    // Get Prices
    const { data: prices } = await supabase
      .from('prices')
      .select('product_id, amount_cents')
      .in('product_id', productIds)

    // 3. Combine Data in Memory
    let totalCents = 0
    const lineItems = usage.map((u: any) => {
      const product = products?.find((p: any) => p.id === u.product_id)
      const priceObj = prices?.find((p: any) => p.product_id === u.product_id)
      
      const unitPrice = priceObj?.amount_cents || 0
      const cost = u.usage_count * unitPrice
      totalCents += cost

      return {
        desc: product?.name || 'Unknown Item',
        qty: u.usage_count,
        price: unitPrice / 100,
        total: cost / 100
      }
    })

    // 4. Generate PDF (pdf-lib)
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const { height } = page.getSize()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    page.drawText('INVOICE', { x: 50, y: height - 50, size: 30, font })
    page.drawText(`Date: ${new Date().toISOString().split('T')[0]}`, { x: 50, y: height - 80, size: 12, font })
    
    let y = height - 140
    page.drawText("Description", { x: 50, y, size: 12, font })
    page.drawText("Qty", { x: 250, y, size: 12, font })
    page.drawText("Price", { x: 350, y, size: 12, font })
    page.drawText("Total", { x: 450, y, size: 12, font })
    
    y -= 20
    for (const item of lineItems) {
      page.drawText(item.desc, { x: 50, y, size: 10, font })
      page.drawText(String(item.qty), { x: 250, y, size: 10, font })
      page.drawText(`$${item.price.toFixed(2)}`, { x: 350, y, size: 10, font })
      page.drawText(`$${item.total.toFixed(2)}`, { x: 450, y, size: 10, font })
      y -= 20
    }

    y -= 20
    page.drawText(`TOTAL DUE: $${(totalCents / 100).toFixed(2)}`, { 
        x: 350, y, size: 15, font, color: rgb(0, 0.5, 0) 
    })

    const pdfBytes = await pdfDoc.save()

    // 5. Upload
    const fileName = `${tenant_id}/${customer_id}_${Date.now()}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(fileName, pdfBytes, { contentType: 'application/pdf', upsert: true })

    if (uploadError) throw uploadError

    // 6. Save Record
    const { data: inv, error: invError } = await supabase
      .from('invoices')
      .insert([{
        tenant_id,
        customer_id,
        total_amount_cents: totalCents,
        currency: 'USD',
        status: 'open',
        file_path: fileName
      }])
      .select()
      .single()

    if (invError) throw invError

    return new Response(
      JSON.stringify({ success: true, invoice_id: inv.id, file: fileName }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})