import { NextResponse } from 'next/server';
import { getChats } from '@/app/actions';

export async function GET() {

  try {
    const chats = await getChats()

    return NextResponse.json({ rows: chats, count: chats?.length }, { status: 200 });

  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
