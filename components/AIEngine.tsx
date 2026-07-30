"use client"; 

import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from './chatAction';
import { Send, User, Bot, Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function AIEngine() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "System online. How can I help you clear your working memory today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const messagesString = JSON.stringify(newMessages);
      const response = await getChatResponse(messagesString);
      
      if (response.error) {
        setMessages([...newMessages, { role: 'model', content: `🚨 ${response.error}` }]);
      } else if (response.text) {
        setMessages([...newMessages, { role: 'model', content: response.text }]);
      }
      
    } catch (error: any) {
      setMessages([...newMessages, { role: 'model', content: `🚨 Connection Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Robust copy function that works across all browsers and devices
  const handleCopy = (text: string, index: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset checkmark after 2 seconds
    } catch (err) {
      console.error('Failed to copy', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border border-slate-200 rounded-xl overflow-hidden bg-white shadow-lg font-sans my-10">
      <div className="bg-brand-dark text-white p-4 flex items-center space-x-2">
        <Bot size={24} className="text-brand-teal" />
        <h2 className="text-lg font-semibold tracking-tight">Executive Function OS: Logic Core</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-brand-blue ml-3' : 'bg-slate-700 mr-3'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>

              {/* Message Content & Copy Button */}
              <div className="flex flex-col gap-1">
                {/* select-text forces the browser to allow highlighting! */}
                <div className={`px-4 py-3 text-sm rounded-2xl select-text cursor-text ${msg.role === 'user' ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold'}`}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
                </div>
                
                {/* One-click copy button for AI responses */}
                {msg.role === 'model' && (
                  <button 
                    onClick={() => handleCopy(msg.content, index)}
                    className="self-start flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors px-1"
                  >
                    {copiedIndex === index ? (
                      <><Check size={14} className="text-emerald-500" /> <span className="text-emerald-500">Copied</span></>
                    ) : (
                      <><Copy size={14} /> Copy to clipboard</>
                    )}
                  </button>
                )}
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
              <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-sm rounded-tl-none shadow-sm flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-slate-400" />
                <span>Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input raw data for processing..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm bg-slate-50"
            disabled={false}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-2 bg-brand-dark text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}


