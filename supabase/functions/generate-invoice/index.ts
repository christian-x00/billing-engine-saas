import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { tenant_id, customer_id } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')

    // 1. Fetch Data
    const { data: usage } = await supabase.from('usage_aggregates').select('*').eq('tenant_id', tenant_id).eq('customer_id', customer_id)
    const { data: tenant } = await supabase.from('tenants').select('*').eq('id', tenant_id).single()
    const { data: customer } = await supabase.from('customers').select('*').eq('id', customer_id).single()

    if (!usage || usage.length === 0) throw new Error("No usage data")

    // 2. Process Items
    const productIds = usage.map((u: any) => u.product_id)
    const { data: products } = await supabase.from('products').select('id, name').in('id', productIds)
    const { data: prices } = await supabase.from('prices').select('product_id, amount_cents').in('product_id', productIds)

    let totalCents = 0
    const items = usage.map((u: any) => {
      const prod = products?.find(p => p.id === u.product_id)
      const price = prices?.find(p => p.product_id === u.product_id)?.amount_cents || 0
      const lineTotal = u.usage_count * price
      totalCents += lineTotal
      return { desc: prod?.name || 'Service Usage', qty: u.usage_count, price: price/100, total: lineTotal/100 }
    })

    // 3. Draw Corporate PDF
    const doc = await PDFDocument.create()
    const page = doc.addPage()
    const { width, height } = page.getSize()
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
    const fontReg = await doc.embedFont(StandardFonts.Helvetica)
    const darkBlue = rgb(0.1, 0.1, 0.3)

    // Header Background
    page.drawRectangle({ x: 0, y: height - 100, width: width, height: 100, color: rgb(0.97, 0.97, 0.99) })
    
    // Title
    page.drawText('INVOICE', { x: 50, y: height - 50, size: 20, font: fontBold, color: darkBlue })
    page.drawText(`#${Date.now().toString().substr(-8)}`, { x: 50, y: height - 70, size: 10, font: fontReg, color: rgb(0.5,0.5,0.5) })

    // Vendor Info
    page.drawText('BillingEngine Inc.', { x: width - 150, y: height - 50, size: 12, font: fontBold, color: darkBlue })
    page.drawText('San Francisco, CA', { x: width - 150, y: height - 65, size: 10, font: fontReg })

    // Bill To
    page.drawText('BILL TO', { x: 50, y: height - 140, size: 9, font: fontBold, color: rgb(0.6,0.6,0.6) })
    page.drawText(customer.name, { x: 50, y: height - 155, size: 14, font: fontBold })
    page.drawText(customer.email, { x: 50, y: height - 170, size: 10, font: fontReg })

    // Totals Box
    page.drawRectangle({ x: width - 200, y: height - 180, width: 150, height: 50, color: rgb(0.95, 0.95, 0.95) })
    page.drawText('TOTAL DUE', { x: width - 180, y: height - 150, size: 9, font: fontBold, color: rgb(0.5,0.5,0.5) })
    page.drawText(`$${(totalCents/100).toFixed(2)}`, { x: width - 180, y: height - 170, size: 18, font: fontBold, color: darkBlue })

    // Table Header
    const tY = height - 220
    page.drawText('DESCRIPTION', { x: 50, y: tY, size: 9, font: fontBold, color: rgb(0.6,0.6,0.6) })
    page.drawText('QTY', { x: 300, y: tY, size: 9, font: fontBold, color: rgb(0.6,0.6,0.6) })
    page.drawText('PRICE', { x: 400, y: tY, size: 9, font: fontBold, color: rgb(0.6,0.6,0.6) })
    page.drawText('AMOUNT', { x: 500, y: tY, size: 9, font: fontBold, color: rgb(0.6,0.6,0.6) })
    page.drawLine({ start: {x:50, y:tY-5}, end: {x:550, y:tY-5}, thickness: 1, color: rgb(0.9,0.9,0.9) })

    // Rows
    let y = tY - 25
    for (const item of items) {
      page.drawText(item.desc, { x: 50, y, size: 10, font: fontReg })
      page.drawText(String(item.qty), { x: 300, y, size: 10, font: fontReg })
      page.drawText(`$${item.price.toFixed(2)}`, { x: 400, y, size: 10, font: fontReg })
      page.drawText(`$${item.total.toFixed(2)}`, { x: 500, y, size: 10, font: fontBold })
      y -= 20
    }

    // Footer
    page.drawText('This is a computer generated invoice.', { x: 50, y: 50, size: 8, font: fontReg, color: rgb(0.7,0.7,0.7) })

    const pdfBytes = await doc.save()
    
    // Save
    const fileName = `${tenant_id}/${customer_id}_${Date.now()}.pdf`
    const { error: upErr } = await supabase.storage.from('invoices').upload(fileName, pdfBytes, { contentType: 'application/pdf', upsert: true })
    if(upErr) throw upErr

    const { data: inv, error: iErr } = await supabase.from('invoices').insert([{ tenant_id, customer_id, total_amount_cents: totalCents, currency: 'USD', status: 'open', file_path: fileName }]).select().single()
    if(iErr) throw iErr

    return new Response(JSON.stringify({ success: true, id: inv.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } })
  }
})