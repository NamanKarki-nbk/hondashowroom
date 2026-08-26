"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from '@ai-sdk/react';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { messages, sendMessage, status, error, setMessages } = useChat({
    initialMessages: [
      { id: '1', role: 'assistant', content: "Hi there! I'm the Honda AI assistant. I can help you with vehicle queries, finance options, accessories, manuals, and store locations. How can I help you today?" }
    ],
    maxSteps: 5
  } as any);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue('');
    sendMessage({ text });
  };

  return (
    <div className="fixed bottom-[84px] md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[340px] max-h-[80vh] shadow-2xl rounded-xl overflow-hidden flex flex-col bg-[#FAF5F5] dark:bg-slate-900"
          >
            {/* Header */}
            <div className="px-5 py-5 pb-3">
               <h3 className="text-[#3b4754] dark:text-gray-100 font-bold text-[13px] tracking-wide">Honda AI Chatbot</h3>
            </div>
            
            {/* Chat Body */}
            <div className="px-5 pb-4 max-h-[350px] overflow-y-auto flex flex-col gap-3 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-[14px] p-4 text-[14px] text-[#3b4754] dark:text-gray-100 shadow-sm border border-gray-100/50 dark:border-white/10 leading-relaxed">
                  Namaste! Ma tapaai lai motorcycle ra scooter ko tulana garna madad garna sakchu. Ke khojdai hunuhunchha?
                </div>
              ) : (
                messages.map((m) => {
                  // Get text content from parts or content
                  const textContent = m.parts
                    ?.filter((p: any) => p.type === 'text')
                    .map((p: any) => p.text)
                    .join('') || (m as any).content || (m as any).text;
                  
                  if (!textContent) return null; // Don't render empty tool call bubbles
                  return (
                    <div
                      key={m.id}
                      className={`rounded-[14px] p-4 text-[14px] shadow-sm leading-relaxed max-w-[90%] ${
                        m.role === 'user' 
                          ? 'bg-primary text-white self-end' 
                          : 'bg-white dark:bg-slate-800 text-[#3b4754] dark:text-gray-100 border border-gray-100/50 dark:border-white/10 self-start'
                      }`}
                    >
                      {textContent}
                    </div>
                  );
                })
              )}
              {error && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-3 text-sm bg-red-100 text-red-700 rounded-bl-none">
                    ⚠️ {error.message?.includes('429') || error.message?.includes('quota')
                      ? 'API rate limit exceeded. Please wait and try again.'
                      : 'Something went wrong. Please try again.'}
                  </div>
                </div>
              )}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="bg-white dark:bg-slate-800 rounded-[14px] p-4 text-[14px] text-[#3b4754] dark:text-gray-100 shadow-sm border border-gray-100/50 dark:border-white/10 self-start">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-5 pb-3">
              <form onSubmit={onSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask me anything"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg pl-4 pr-10 py-3.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 shadow-sm"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 fill-current" />
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="flex justify-center items-center pb-4 text-[11px] text-gray-800 dark:text-gray-200 font-medium">
               Built on <span className="font-extrabold ml-1 tracking-tighter text-sm">honda AI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-[#a02015] transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? (
           <X className="w-6 h-6 stroke-[3]" />
        ) : (
           <MessageCircle className="w-6 h-6 stroke-[2]" />
        )}
      </button>
    </div>
  );
}
