import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});
// Helper function to convert File to Base64
const fileToBase64 = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
};
// Helper function to generate a unique filename
const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
};
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.' }, { status: 400 });
        }
        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 });
        }
        // Convert file to base64
        const base64Data = await fileToBase64(file);
        const uniqueFileName = generateUniqueFileName(file.name);
        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: base64Data,
            fileName: uniqueFileName,
            folder: '/100gaj',
            useUniqueFileName: true,
        });
        return new NextResponse(JSON.stringify({
            success: true,
            url: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            fileId: uploadResponse.fileId
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || 'Internal server error during file upload' }, { status: 500 });
    }
}
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
