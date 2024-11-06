// app/api/companyOverview/route.js

import prisma from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const companies = await prisma.companies.findMany({

    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Failed to fetch company overview:', error);

    return NextResponse.json(
      { error: 'Failed to fetch company overview' },
      { status: 500 }
    );
  }
}
