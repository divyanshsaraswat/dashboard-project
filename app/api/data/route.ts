import { NextResponse } from 'next/server';
import { generateInitialDataset } from '@/lib/dataGenerator';

export const runtime = 'edge';

export async function GET() {
  const data = generateInitialDataset(1000);
  return NextResponse.json({ data });
}

