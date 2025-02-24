// app/api/symbol-search/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export async function GET(req: Request) {
  try {
    // Extract query parameter 'symbol' from the URL
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    // Fetch data from Finnhub API
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${symbol}&token=${FINNHUB_API_KEY}&exchange=US`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data from Finnhub' }, { status: 500 });
  }
}
