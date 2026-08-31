import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/upload';
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("auth_session")?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'honda-showroom/features';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const imageUrl = await uploadToCloudinary(file, folder);

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    );
  }
}
