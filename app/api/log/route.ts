import { NextResponse } from "next/server";

// 👇 FIX: Ab hum '@' ki jagah relative path use kar rahe hain jo 100% chalega
import connectDB from "../../../src/lib/db"; 
import WorkoutLog from "../../../src/models/WorkoutLog";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { workoutName, duration, exercises } = body;

    console.log("📥 Saving Workout:", workoutName);

    const newLog = await WorkoutLog.create({
      workoutName,
      duration,
      exercises,
    });

    console.log("✅ Saved ID:", newLog._id);
    
    return NextResponse.json({ message: "Workout Saved!", id: newLog._id });

  } catch (error: any) {
    console.error("❌ Save Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}