"use server";

export async function getChatResponse(messagesJsonString: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return { error: "Configuration Error: GEMINI_API_KEY is missing in Vercel." };
    }

    const messages = JSON.parse(messagesJsonString);
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }]
    }));

    if (formattedMessages.length > 0 && formattedMessages[0].role === 'model') {
      formattedMessages.shift();
    }

    const payload = {
      contents: formattedMessages,
      systemInstruction: { 
        parts: [{ text: "You are the core logic engine for Executive Function OS. Your communication style is crisp, analytical, and highly structured, like a well-designed computer terminal but friendly. Categorize thoughts into: 1. Immediate Actions, 2. Delegated Tasks, and 3. Backlog." }] 
      }
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
       return { error: `Google API Error: ${data.error?.message || "Unknown error"}` };
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    return { text: aiText };

  } catch (error: any) {
    return { error: `Server Action Failed: ${error.message}` };
  }
}