"use client";
import Link from "next/link";
// 👇 FIX: Relative path use kiya hai kyunki component src folder me hai
import ThemeToggle from "../src/components/ThemeToggle";

export default function Home() {
  return (
    // Main container with dynamic background rendering
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Background Effects (Glow blobs) - Only visible in Dark Mode */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none hidden dark:block">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center z-10">
        <div className="font-extrabold text-2xl tracking-tighter flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400">
            FitAI
          </span>
        </div>
        <ThemeToggle />
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 z-10 -mt-20">
        
        {/* Badge */}
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50 shadow-sm">
          ✨ AI-Powered Fitness Revolution
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight max-w-4xl leading-tight text-gray-900 dark:text-white">
          Your dream physique, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 dark:from-purple-400 dark:via-blue-400 dark:to-purple-400 animate-gradient">
            engineered by AI.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed">
          Stop guessing. Get personalized workout plans, track your progress, and smash your limits with the smartest fitness coach.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/generate" className="flex-1">
            <button className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95 text-lg">
              Generate Workout ⚡
            </button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <button className="w-full py-4 px-8 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700 transition-all active:scale-95 text-lg backdrop-blur-md">
              My Dashboard 📊
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}