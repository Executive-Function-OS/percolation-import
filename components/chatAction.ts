"use server"; // This magic line tells Next.js to NEVER send this file to the browser. It hides your API key!

export async function getChatResponse(messages: any[]) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in Vercel settings.");
    }

    // Format messages for Gemini
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }]
    }));

    // Remove the initial AI greeting
    if (formattedMessages.length > 0 && formattedMessages[0].role === 'model') {
      formattedMessages.shift();
    }

    const systemInstruction = "You are the core logic engine for Executive Function OS. Your communication style is crisp, analytical, and highly structured, like a well-designed computer terminal but friendly. When users give you a brain-dump of tasks, your job is to act as their external 'Working Memory'. Categorize their thoughts into: 1. Immediate Actions, 2. Delegated Tasks, and 3. Backlog. Use bolding for key terms and keep your language highly efficient.";

    const payload = {
      contents: formattedMessages,
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    // Call Gemini 2.0 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
       console.error("Gemini API Error:", data);
       throw new Error(data.error?.message || "Google API Error");
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

  } catch (error: any) {
    console.error("Server Action Error:", error);
    throw new Error(error.message || "Failed to reach AI engine");
  }
}

