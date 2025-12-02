"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalWorkouts: 0, totalVolume: 0, totalHours: 0 });

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        const processedData = data.map((log: any) => {
          let vol = 0;
          log.exercises.forEach((ex: any) => {
            ex.sets.forEach((s: any) => {
              vol += (s.weight || 0) * (s.reps || 0);
            });
          });
          
          return {
            date: new Date(log.date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
            volume: vol,
            duration: Math.round(log.duration / 60),
            name: log.workoutName
          };
        }).reverse();

        setHistory(processedData);
        
        const totalVol = processedData.reduce((acc: number, curr: any) => acc + curr.volume, 0);
        const totalMins = processedData.reduce((acc: number, curr: any) => acc + curr.duration, 0);

        setStats({
          totalWorkouts: data.length,
          totalVolume: totalVol,
          totalHours: Math.round(totalMins / 60),
        });

        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold dark:text-white">Loading Analytics... 📊</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your fitness journey in numbers</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg font-bold text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">
            🏠 Home
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Total Workouts</p>
            <p className="text-3xl font-bold mt-1">{stats.totalWorkouts}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Volume Lifted</p>
            <p className="text-3xl font-bold mt-1 text-purple-600">{(stats.totalVolume / 1000).toFixed(1)}k <span className="text-sm text-gray-400">kg</span></p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Time Invested</p>
            <p className="text-3xl font-bold mt-1 text-blue-500">{stats.totalHours} <span className="text-sm text-gray-400">hrs</span></p>
          </div>
        </div>

        {/* Graph 1: Volume */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg">
          <h2 className="text-lg font-bold mb-6">Volume Progress (kg) 📈</h2>
          <div className="h-[300px] w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderRadius: '10px', border: 'none', color: '#fff' }} />
                  <Area type="monotone" dataKey="volume" stroke="#8884d8" fillOpacity={1} fill="url(#colorVol)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-gray-400">No data yet</div>}
          </div>
        </div>

        {/* Recent List */}
        <div>
          <h2 className="text-lg font-bold mb-4">Recent Logs</h2>
          <div className="space-y-3">
            {history.slice().reverse().map((log: any, i: number) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{log.name}</h3>
                  <p className="text-xs text-gray-500">{log.date} • {log.duration} mins</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{log.volume} kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}