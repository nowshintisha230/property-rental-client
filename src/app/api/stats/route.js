import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // TODO: put your real stats logic here
    const stats = {
      totalProperties: 0,
      totalUsers: 0,
      totalBookings: 0,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("GET /api/stats failed:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}