import { NextResponse } from "next/server";
import { swaggerSpec } from "@/app/lib/swagger";

// Expose Swagger spec as JSON
export async function GET() {
  return NextResponse.json(swaggerSpec);
}
