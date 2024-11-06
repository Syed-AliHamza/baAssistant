import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  const { email } = params
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid Clerk ID' }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
