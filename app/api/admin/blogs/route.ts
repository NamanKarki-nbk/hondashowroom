import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/upload';
import { logActivity } from "@/lib/activityLogger";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

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
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToCloudinary(imageFile, 'honda-showroom/blogs');
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        imageUrl,
        author: author || "Admin",
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "CREATE",
      entity: "Blog",
      entityId: blog.id,
      details: {
        title: blog.title,
        author: blog.author,
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const imageFile = formData.get('image') as File | null;
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    let imageUrl = existingBlog.imageUrl;
    
    // If a new image is provided, upload it and delete the old one
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToCloudinary(imageFile, 'honda-showroom/blogs');
      
      if (existingBlog.imageUrl && existingBlog.imageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(existingBlog.imageUrl);
      }
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl,
        author: author || "Admin",
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Blog",
      entityId: blog.id,
      details: {
        title: blog.title,
        author: blog.author,
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (blog && blog.imageUrl && blog.imageUrl.includes('cloudinary.com')) {
      await deleteFromCloudinary(blog.imageUrl);
    }

    await prisma.blog.delete({
      where: { id }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "DELETE",
      entity: "Blog",
      entityId: id,
      details: {
        id,
        title: blog?.title,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
