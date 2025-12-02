import { NextResponse } from "next/server";
import connectDB from "../../../src/lib/db";
import WorkoutLog from "../../../src/models/WorkoutLog";

// 👇 YE LINE SABSE ZAROORI HAI (Build Error Fix)
export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    await connectDB();
    
    // Sabse naya workout sabse upar (sort by createdAt descending)
    const logs = await WorkoutLog.find().sort({ createdAt: -1 });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("History Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}