import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a1f12] text-white flex flex-col items-center justify-center p-6">
      {/* Floating leaves background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0.1 }}
            animate={{ y: "-10vh", rotate: 360, opacity: [0, 0.3, 0] }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute text-emerald-500/20"
          >
            <Leaf size={24 + Math.random() * 30} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-sm mb-6 inline-block">
            Powered by Groq & LangChain
          </span>
          <h1 className="text-6xl font-extrabold tracking-tight mb-6">
            AI-Powered Farmer <br />
            <span className="text-gradient">Crop Advisory Assistant</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Intelligent agricultural insights grounded in 50+ specialized agronomy documents. Get instant, citation-backed answers to your farming questions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center gap-4"
        >
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
          >
            Enter Dashboard <ArrowRight size={20} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          <GlassCard delay={0.4}>
            <Zap className="text-emerald-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Lightning Fast RAG</h3>
            <p className="text-gray-400">Powered by LLaMa-3 via Groq for instantaneous semantic retrieval and generation.</p>
          </GlassCard>
          <GlassCard delay={0.5}>
            <ShieldCheck className="text-lime-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Verified Citations</h3>
            <p className="text-gray-400">Every piece of advice comes with direct citations to authoritative agricultural documents.</p>
          </GlassCard>
          <GlassCard delay={0.6}>
            <Leaf className="text-emerald-400 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">50+ Crop Guides</h3>
            <p className="text-gray-400">Comprehensive knowledge base covering pest control, fertilization, and crop rotation.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
