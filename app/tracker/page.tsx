"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackerPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [logs, setLogs] = useState<any>({}); // User inputs yahan save honge
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // 1. Load Plan from LocalStorage
  useEffect(() => {
    const data = localStorage.getItem("generatedPlan");
    if (data) {
      setPlan(JSON.parse(data));
      setIsActive(true); // Timer auto-start
    } else {
      router.push("/generate");
    }
  }, [router]);

  // 2. Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Helper: Format Time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 3. Handle Input Change (Weight/Reps)
  const handleInputChange = (exerciseIndex: number, setIndex: number, field: string, value: string) => {
    const key = `${exerciseIndex}-${setIndex}`;
    setLogs({ ...logs, [key]: { ...logs[key], [field]: value } });
  };

  // 4. FINISH WORKOUT & SAVE TO DB (Main Logic)
  const finishWorkout = async () => {
    if (!confirm("Are you sure you want to finish this workout?")) return;
    
    setIsActive(false); // Stop Timer

    // Data format kar rahe hain taaki DB me sahi se jaye
    const formattedExercises = plan.exercises.map((ex: any, exIndex: number) => {
      const setsData = [];
      const setCount = parseInt(ex.sets) || 3;
      
      for (let i = 0; i < setCount; i++) {
        const key = `${exIndex}-${i}`;
        const logData = logs[key] || {};
        setsData.push({
          weight: parseInt(logData.weight) || 0,
          reps: parseInt(logData.reps) || 0
        });
      }

      return {
        name: ex.name,
        sets: setsData
      };
    });

    const payload = {
      workoutName: plan.workoutName,
      duration: timer, // Total seconds
      exercises: formattedExercises
    };

    try {
      // Sending to Backend API
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(`Workout Saved Successfully! Time: ${formatTime(timer)} 🔥`);
        router.push("/"); // Wapas Home bhej do
      } else {
        const err = await res.json();
        alert("Error saving workout: " + (err.error || "Unknown Error"));
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving.");
    }
  };

  if (!plan) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold">Loading Tracker...</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      
      {/* Sticky Header (Timer) */}
      <div className="sticky top-0 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center z-10">
        <div>
          <h2 className="font-bold text-lg text-white truncate max-w-[200px]">{plan.workoutName}</h2>
          <p className="text-xs text-gray-400">Track your lifts</p>
        </div>
        <div className="bg-purple-600 px-4 py-2 rounded-lg font-mono font-bold text-xl shadow-[0_0_10px_rgba(168,85,247,0.5)]">
          {formatTime(timer)}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {plan.exercises?.map((ex: any, exIndex: number) => (
          <div key={exIndex} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            
            {/* Exercise Title */}
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <h3 className="font-bold text-lg">{ex.name}</h3>
              <p className="text-xs text-gray-400">Target: {ex.sets} Sets × {ex.reps} Reps</p>
            </div>

            {/* Sets Inputs */}
            <div className="p-4 space-y-3">
              {Array.from({ length: parseInt(ex.sets) || 3 }).map((_, setIndex) => (
                <div key={setIndex} className="flex items-center gap-3">
                  <span className="text-gray-500 font-bold w-6">#{setIndex + 1}</span>
                  
                  <input
                    type="number"
                    placeholder="kg"
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-center text-white focus:border-purple-500 outline-none transition-colors"
                    onChange={(e) => handleInputChange(exIndex, setIndex, "weight", e.target.value)}
                  />
                  
                  <input
                    type="number"
                    placeholder="reps"
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-center text-white focus:border-purple-500 outline-none transition-colors"
                    onChange={(e) => handleInputChange(exIndex, setIndex, "reps", e.target.value)}
                  />
                  
                  {/* Fake Done Button for UX */}
                  <div className="min-w-[40px] h-[40px] bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 cursor-pointer hover:bg-green-900/30 hover:border-green-500 hover:text-green-500 transition-all active:scale-90">
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 p-4 z-20">
        <button 
          onClick={finishWorkout}
          className="w-full py-4 bg-green-500 text-black font-extrabold text-lg rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400 hover:scale-[1.02] transition-all active:scale-95"
        >
          COMPLETE WORKOUT ✅
        </button>
      </div>

    </div>
  );
}