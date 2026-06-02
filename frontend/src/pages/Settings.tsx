import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { Settings as SettingsIcon, Save, Moon, Sun, Cpu, MessageSquare } from 'lucide-react';

const Settings = () => {
  const [theme, setTheme] = useState('dark');
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [systemPrompt, setSystemPrompt] = useState('You are an expert AI Farmer Crop Advisory Assistant.\nUse ONLY the context below to answer the question.\nAlways end your answer with a citation like: [Source: document_name].');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2 flex items-center gap-3">
          <SettingsIcon size={32} className="text-emerald-400" />
          System Settings
        </h1>
        <p className="text-gray-400">Configure your AI models, prompts, and application preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <Cpu size={24} />
            <h3 className="text-xl font-bold text-white">AI Model Selection</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Choose the LLM that powers your agricultural assistant.</p>
          <div className="flex gap-4">
            {['llama-3.3-70b-versatile', 'llama3-8b-8192 (Deprecated)', 'mixtral-8x7b-32768'].map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                disabled={m.includes('Deprecated')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  model === m
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 bg-black/20 hover:border-white/20'
                } ${m.includes('Deprecated') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-bold">{m}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <MessageSquare size={24} />
            <h3 className="text-xl font-bold text-white">System Prompt Configuration</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Instruct the AI on how it should behave and format its answers.</p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-32 bg-black/40 border border-emerald-500/30 rounded-xl p-4 text-gray-200 outline-none focus:border-emerald-500 transition-colors resize-none"
          />
        </GlassCard>

        <GlassCard delay={0.3}>
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <Moon size={24} />
            <h3 className="text-xl font-bold text-white">Appearance</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Customize the UI theme of the dashboard.</p>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === 'dark' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-black/20 hover:border-white/20'
              }`}
            >
              <Moon size={20} /> Dark Mode
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === 'light' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-black/20 hover:border-white/20'
              }`}
            >
              <Sun size={20} /> Light Mode
            </button>
          </div>
        </GlassCard>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end pt-4"
      >
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:opacity-90 text-black font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          {isSaving ? 'Saving...' : <><Save size={20} /> Save Configuration</>}
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
