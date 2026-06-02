import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI Farmer Crop Advisory Assistant. Ask me anything about crop cultivation, pest control, or soil management based on our 50+ agronomy documents.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Add typing indicator
    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: typingId, role: 'assistant', content: '', timestamp: new Date(), isTyping: true }]);

    try {
      const response = await axios.post('http://localhost:5000/api/chat/query', { message: userMsg.content });
      
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...msg, content: response.data.answer, isTyping: false }
          : msg
      ));
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...msg, content: 'Sorry, I encountered an error retrieving the information.', isTyping: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-gradient-to-tr from-emerald-500 to-lime-500 text-black' : 'bg-gray-800 border border-emerald-500/30 text-emerald-400'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <GlassCard className={`max-w-[80%] ${msg.role === 'user' ? 'bg-emerald-500/10 border-emerald-500/20' : ''} !p-4`}>
                {msg.isTyping ? (
                  <div className="flex gap-1 items-center h-6">
                    <motion.div className="w-2 h-2 bg-emerald-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-emerald-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-emerald-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.4 }} />
                  </div>
                ) : (
                  <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </motion.div>

      <GlassCard className="!p-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about crop diseases, fertilizers..."
          className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder:text-gray-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 flex items-center justify-center text-black disabled:opacity-50 transition-opacity"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </GlassCard>
    </div>
  );
};

export default ChatInterface;
