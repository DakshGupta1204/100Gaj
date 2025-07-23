// app/api/geocode/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
export async function GET(req) {
    const query = req.nextUrl.searchParams.get("q");
    if (!query) {
        return NextResponse.json({ error: "Missing address query" }, { status: 400 });
    }
    try {
        const result = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: query,
                format: "json",
                limit: 1,
            },
            headers: {
                'User-Agent': '100GajPropertyApp/1.0 (contact@100gaj.com)',
                'Referer': 'https://100gaj.vercel.app',
            },
        });
        return NextResponse.json(result.data);
    }
    catch (_error) {
        return NextResponse.json({ error: "Failed to fetch coordinates" }, { status: 500 });
    }
}
