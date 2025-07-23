import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const location = formData.get('location');
  const size = formData.get('size');
  const price = formData.get('price');
  const file = formData.get('file');

  // TODO: Save property to DB and handle file upload
  // Example response:
  return NextResponse.json({ success: true, message: 'Property added (mocked, implement DB logic)' });
}



