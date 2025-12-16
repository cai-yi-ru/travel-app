
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}
