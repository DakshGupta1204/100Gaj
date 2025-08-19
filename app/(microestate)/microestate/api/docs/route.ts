import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the API specification from your JSON file
    const specPath = path.join(process.cwd(), 'app', '(microestate)', 'lib', 'api.json');
    const specContent = fs.readFileSync(specPath, 'utf-8');
    const apiSpec = JSON.parse(specContent);

    // Update server URLs based on the request
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    
    apiSpec.servers = [
      {
        url: `${protocol}://${host}/microestate/api`,
        description: 'Current environment'
      },
      ...apiSpec.servers
    ];

    return NextResponse.json(apiSpec, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error serving API documentation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load API specification',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add a redirect for common documentation paths
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}