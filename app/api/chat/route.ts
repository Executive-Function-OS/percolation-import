import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawMessages = body.messages || [];

    // 1. Format for Gemini
    const formattedMessages = rawMessages.map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }]
    }));

    // 2. Remove initial model greeting to prevent Google 400 error
    if (formattedMessages.length > 0 && formattedMessages[0].role === 'model') {
      formattedMessages.shift();
    }

    // 3. Get API Key from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in Vercel settings" }, { status: 500 });
    }

    // 4. The OS Personality
    const systemInstruction = "You are the core logic engine for Executive Function OS. Your communication style is crisp, analytical, and highly structured, like a well-designed computer terminal but friendly. When users give you a brain-dump of tasks, your job is to act as their external 'Working Memory'. Categorize their thoughts into: 1. Immediate Actions, 2. Delegated Tasks, and 3. Backlog. Use bolding for key terms and keep your language highly efficient.";

    const payload = {
      contents: formattedMessages,
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    // 5. Send to Google
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    // 6. Handle Google Errors Gracefully
    if (!response.ok) {
       console.error("Gemini API Error:", data);
       return NextResponse.json({ error: data.error?.message || "Error from Google" }, { status: response.status });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    
    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

