import React, { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { FileText, Database, CheckCircle, Target } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const evaluationData = [
  { subject: 'Faithfulness', A: 0.92, fullMark: 1.0 },
  { subject: 'Answer Relevancy', A: 0.88, fullMark: 1.0 },
  { subject: 'Context Precision', A: 0.85, fullMark: 1.0 },
  { subject: 'Context Recall', A: 0.90, fullMark: 1.0 },
  { subject: 'Retrieval Acc', A: 0.87, fullMark: 1.0 },
];

const queryTrends = [
  { name: 'Mon', queries: 45 },
  { name: 'Tue', queries: 52 },
  { name: 'Wed', queries: 38 },
  { name: 'Thu', queries: 65 },
  { name: 'Fri', queries: 48 },
  { name: 'Sat', queries: 25 },
  { name: 'Sun', queries: 30 },
];

const StatCard = ({ icon: Icon, label, value, delay }: any) => (
  <GlassCard delay={delay} className="flex items-center gap-4">
    <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </GlassCard>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDocuments: 50,
    totalChunks: 1245,
    queriesAnswered: 303,
    avgAccuracy: 88.4
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Farmer Dashboard</h1>
        <p className="text-gray-400">System overview and RAG evaluation metrics.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={FileText} label="Total Documents" value={stats.totalDocuments} delay={0.1} />
        <StatCard icon={Database} label="Total Chunks" value={stats.totalChunks} delay={0.2} />
        <StatCard icon={CheckCircle} label="Queries Answered" value={stats.queriesAnswered} delay={0.3} />
        <StatCard icon={Target} label="Avg Accuracy" value={`${stats.avgAccuracy}%`} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <GlassCard delay={0.5} className="h-96 flex flex-col">
          <h3 className="text-lg font-bold mb-4">RAGAS Evaluation Metrics</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={evaluationData}>
                <PolarGrid stroke="rgba(16, 185, 129, 0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 1]} tick={{ fill: 'transparent' }} />
                <Radar
                  name="Metrics"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard delay={0.6} className="h-96 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Query Trends (Last 7 Days)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queryTrends}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  contentStyle={{ backgroundColor: '#0a1f12', border: '1px solid #10b981' }} 
                />
                <Bar dataKey="queries" fill="#84cc16" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
