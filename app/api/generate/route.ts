import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 👇 YEH HAI MAGIC FIX: List me se 'gemini-2.0-flash' uthaya hai
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const body = await req.json();
    const { muscle, equipment, level } = body;

    const prompt = `
      Act as a professional fitness trainer. Create a workout plan for a ${level} level person targeting ${muscle} using ${equipment}.
      
      IMPORTANT: Return the response ONLY in valid JSON format. Do not add any markdown formatting like \`\`\`json.
      Structure:
      {
        "workoutName": "Creative Name",
        "exercises": [
          { "name": "Exercise Name", "sets": "3", "reps": "12", "tips": "Short tip" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    let text = response.text();
    // Safai Abhiyaan: Agar AI ne galti se markdown lagaya to hata denge
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const plan = JSON.parse(text);

    return NextResponse.json(plan);

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ 
      error: "AI Error", 
      details: error.message 
    }, { status: 500 });
  }
}