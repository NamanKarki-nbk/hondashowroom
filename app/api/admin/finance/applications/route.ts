import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'ALL' ? { status } : {};

    const applications: any[] = [];

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Failed to fetch finance applications:', error);
    return NextResponse.json({ error: 'Failed to fetch finance applications' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { id, status } = data;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const application: any = {};

    return NextResponse.json(application);
  } catch (error) {
    console.error('Failed to update finance application:', error);
    return NextResponse.json({ error: 'Failed to update finance application' }, { status: 500 });
  }
}
