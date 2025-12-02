"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WorkoutPage() {
  const [plan, setPlan] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // LocalStorage se data uthayenge
    const data = localStorage.getItem("generatedPlan");
    if (data) {
      try {
        setPlan(JSON.parse(data));
      } catch (e) {
        console.error("JSON Parse Error", e);
      }
    } else {
      router.push("/generate"); // Data nahi hai to wapas bhejo
    }
  }, [router]);

  if (!plan) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="animate-pulse text-xl font-bold">Loading your gains... 💪</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {plan.workoutName || "Your Workout"} 
          </h1>
          <p className="text-gray-400 text-sm">AI Generated Custom Routine</p>
        </div>

        {/* Exercises List (Safety Check Added) */}
        <div className="space-y-4">
          {plan.exercises && plan.exercises.length > 0 ? (
            plan.exercises.map((ex: any, index: number) => (
              <div key={index} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex justify-between items-center shadow-lg hover:border-purple-500/50 transition-all">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white">{ex.name}</h3>
                  <p className="text-xs text-gray-500 bg-gray-800 inline-block px-2 py-1 rounded-md">💡 {ex.tips}</p>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-2xl font-bold text-purple-400">{ex.sets}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Sets</p>
                  <p className="text-sm font-medium text-white mt-1">{ex.reps} Reps</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No exercises generated. Try again!</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-4 space-y-3">
          {/* 👇 UPDATED BUTTON: Navigates to Tracker */}
          <button 
            onClick={() => router.push("/tracker")} 
            className="w-full py-4 bg-white text-black font-bold rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-gray-200 transition-transform active:scale-95"
          >
            Start Workout 🔥
          </button>
          
          <Link href="/generate" className="block w-full py-4 bg-gray-900 border border-gray-800 text-center text-gray-400 font-bold rounded-2xl hover:bg-gray-800 transition-all">
            Regenerate Plan 🔄
          </Link>
        </div>

      </div>
    </div>
  );
}