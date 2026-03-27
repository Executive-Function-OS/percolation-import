"use client"; 

import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from './chatAction';
import { Send, User, Bot, Loader2 } from 'lucide-react';

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
      
      // Call the secure Server Action (this is what reads your Vercel variable!)
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

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border border-slate-200 rounded-xl overflow-hidden bg-white shadow-lg font-sans my-10">
      <div className="bg-[#0F172A] text-white p-4 flex items-center space-x-2">
        <Bot size={24} className="text-[#0D9488]" />
        <h2 className="text-lg font-semibold tracking-tight">Executive Function OS: Logic Core</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-[#1E40AF] ml-3' : 'bg-slate-700 mr-3'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`px-4 py-3 text-sm rounded-2xl ${msg.role === 'user' ? 'bg-[#1E40AF] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                {msg.content.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
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
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm bg-slate-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}


