import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl || null,
        author: body.author || null,
      }
    });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || null,
        author: data.author || null,
      }
    });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.blog.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
