import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = 'https://www.alphavantage.co/query';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        function: 'TIME_SERIES_MONTHLY_ADJUSTED',
        symbol,
        apikey: apiKey,
      },
    });

    const data = response.data['Monthly Adjusted Time Series'];

    if (!data) {
      return NextResponse.json({ error: 'Stock data not found' }, { status: 404 });
    }

    const formattedData = Object.entries(data).map(([date, values]: any) => ({
      date,
      stock: parseFloat(values['5. adjusted close']),
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Error fetching stock data' }, { status: 500 });
  }
}
