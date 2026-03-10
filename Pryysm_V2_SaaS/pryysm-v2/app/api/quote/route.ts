import { NextRequest, NextResponse } from 'next/server'
import { calculateQuote } from '@/lib/quote-calculator'
import type { QuoteInput } from '@/lib/quote-calculator'

export async function POST(req: NextRequest) {
  try {
    const body: QuoteInput = await req.json()

    if (!body.volumeCm3 || !body.material || !body.infillPct || !body.quality) {
      return NextResponse.json({ error: 'Missing required fields: volumeCm3, material, infillPct, quality' }, { status: 400 })
    }

    const result = calculateQuote(body)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// GET example for testing
export async function GET() {
  const example = calculateQuote({ volumeCm3: 50, material: 'PLA+', infillPct: 20, quality: 'standard' })
  return NextResponse.json({ example, message: 'POST to /api/quote with QuoteInput body' })
}
