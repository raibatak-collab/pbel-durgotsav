import { NextRequest, NextResponse } from "next/server";
import { getSnapshotData } from "@/data/seedSnapshot";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const cleanKey = key.replace(/^config_/, "");

  try {
    const data = getSnapshotData(cleanKey, null);
    
    return NextResponse.json(data !== null ? data : {}, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Edge-Cache-Status": "HIT",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load config" },
      { status: 500 }
    );
  }
}
