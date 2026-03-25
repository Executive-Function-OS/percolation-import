import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Key } from 'lucide-react';

// This is a self-contained AI Chat Engine component.
// You can mount this anywhere in your React application.
export default function App() {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(''); // In production, fetch this from your backend!
  const [showSettings, setShowSettings] = useState(true);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!apiKey) {
      alert("Please enter a Gemini API key in the settings first.");
      setShowSettings(true);
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for the Gemini API
      const history = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Add the new user message
      history.push({
        role: 'user',
        parts: [{ text: userMessage.content }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: history,
            // You can add system instructions here to customize the AI's personality
            systemInstruction: {
              parts: [{ text: "You are a helpful, concise AI assistant for Executive Function OS." }]
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

      setMessages(prev => [...prev, { role: 'model', content: aiResponseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: `Error: ${error.message}. Please check your API key and connection.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg font-sans">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot size={24} className="text-blue-400" />
          <h2 className="text-lg font-semibold">Executive Function OS AI</h2>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          title="Settings"
        >
          <Key size={18} />
        </button>
      </div>

      {/* Settings Panel (API Key) */}
      {showSettings && (
        <div className="bg-slate-50 p-4 border-b border-gray-200 text-sm">
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-slate-700">Gemini API Key (Local Test Mode)</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500">
              For testing only. In your GitHub repository, you should route calls through a backend server or serverless function to keep your API key secure.
            </p>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-blue-600 ml-3' : 'bg-slate-700 mr-3'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}>
                {/* Render text with basic line break support */}
                {msg.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i !== msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[80%]">
               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 mr-3 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 text-slate-800 rounded-tl-none shadow-sm flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-slate-400" />
                <span className="text-slate-500 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} className={isLoading ? 'opacity-0' : 'opacity-100'} />
            {isLoading && <Loader2 size={20} className="animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
          </button>
        </form>
      </div>
    </div>
  );
}

