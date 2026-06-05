import React, { useState } from 'react';
import { X, Sparkles, Send, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { Project, Role } from '../types';

interface AIChatProps {
  onClose: () => void;
  mode: 'gemini' | 'simulated';
  projectContext?: Project;
  role?: Role;
}

export default function AIChat({ onClose, mode, projectContext, role }: AIChatProps) {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: projectContext
        ? `Hello! I am your AI Assistant powered by Gemini for ${projectContext.name}. How can I help you with this specific project?`
        : 'Hello! I am your Align Moldit AI Assistant powered by Gemini. Ask me anything about manufacturing terms, project statuses, or general queries.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      let systemPrompt = `You are an AI assistant for a manufacturing company called Allied Moulded Products. Use professional, industrial terminology. Answer this query concisely.`;
      
      if (role) {
        systemPrompt += ` The user asking is a ${role}. Tailor your response to their level of access and concerns.`;
      }

      if (projectContext) {
        systemPrompt += ` The user is asking about a specific project: ${projectContext.name} (ID: ${projectContext.salesOrder}). 
        Current status: ${projectContext.status}. Progress: ${projectContext.progress}%. 
        Due Date: ${projectContext.dueDate}.
        Current Revision: ${projectContext.currentRevision}.
        Answer their query based on this project context.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${systemPrompt}\n\nUser Query: ${userText}`,
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'No response generated.' }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error connecting to the Gemini API. Please ensure your API key is configured correctly.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden"
      style={{ height: '500px', maxHeight: '80vh' }}
    >
      <div className="bg-gradient-to-r from-[#1E2538] to-[#2a344d] p-4 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-400" />
          <h3 className="font-semibold text-sm">
            {projectContext ? `AI: ${projectContext.salesOrder}` : 'Ask AI Assistant'}
          </h3>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
                <Bot size={16} className="text-indigo-600" />
              </div>
            )}
            <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-[#1E2538] text-white rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
            }`}>
              {/* Simple markdown bold parsing for simulated responses */}
              {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
              <Bot size={16} className="text-indigo-600" />
            </div>
            <div className="p-3 rounded-2xl text-sm bg-white border border-slate-200 text-slate-500 rounded-tl-sm shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 border border-slate-200 focus-within:border-[#1E2538] focus-within:ring-1 focus-within:ring-[#1E2538] transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={projectContext ? "Ask about this project..." : "Ask Gemini AI..."} 
            className="flex-1 bg-transparent border-none px-3 py-2 text-sm outline-none"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
