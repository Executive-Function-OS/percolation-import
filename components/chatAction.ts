"use server";

export async function getChatResponse(messagesJsonString: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("API Key is missing from Vercel environment variables.");
    }

    const messages = JSON.parse(messagesJsonString);

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }]
    }));

    if (formattedMessages.length > 0 && formattedMessages[0].role === 'model') {
      formattedMessages.shift();
    }

    const systemInstruction = "You are the core logic engine for Executive Function OS. Your communication style is crisp, analytical, and highly structured, like a well-designed computer terminal but friendly. When users give you a brain-dump of tasks, your job is to act as their external 'Working Memory'. Categorize their thoughts into: 1. Immediate Actions, 2. Delegated Tasks, and 3. Backlog. Use bolding for key terms and keep your language highly efficient.";

    const payload = {
      contents: formattedMessages,
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store'
      }
    );

    const data = await response.json();

    if (!response.ok) {
       throw new Error(data.error?.message || "Google API Error");
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

  } catch (error: any) {
    console.error("Server Action Error:", error.message); 
    throw new Error(error.message);
  }
}


