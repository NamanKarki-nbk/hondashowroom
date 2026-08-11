"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[340px] shadow-2xl rounded-xl overflow-hidden flex flex-col bg-[#FAF5F5]"
          >
            {/* Header */}
            <div className="px-5 py-5 pb-3">
               <h3 className="text-[#3b4754] font-bold text-[13px] tracking-wide">Honda AI Chatbot</h3>
            </div>
            
            {/* Chat Body */}
            <div className="px-5 pb-4">
               <div className="bg-white rounded-[14px] p-4 text-[14px] text-[#3b4754] shadow-sm border border-gray-100/50 leading-relaxed">
                 Namaste! Ma tapaai lai motorcycle ra scooter ko tulana garna madad garna sakchu. Ke khojdai hunuhunchha?
               </div>
            </div>

            {/* Input Area */}
            <div className="px-5 pb-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask me anything"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300 shadow-sm"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Send className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center items-center pb-4 text-[11px] text-gray-800 font-medium">
               Built on <span className="font-extrabold ml-1 tracking-tighter text-sm">honda AI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#c1291A] text-[#f3ebdd] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-[#a02015] transition-all hover:scale-105 active:scale-95"
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
