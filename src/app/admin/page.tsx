'use client';

import React, { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { getStore, updateStore } from '@/lib/store';
import { 
  Shield, Users, Activity, BarChart3, ToggleLeft, ToggleRight, 
  Trash, Check, AlertTriangle, ShieldCheck, Database, Terminal
} from 'lucide-react';

export default function AdminConsole() {
  const [store, setStore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'moderation' | 'token_usage' | 'ab_tests'>('token_usage');
  
  // Feature Flags
  const [flags, setFlags] = useState({
    socraticDefault: true,
    voiceRecognition: true,
    resumeOptimizations: false,
    collaborativeWhiteboard: true,
  });

  // A/B Prompting Strategies
  const [promptStrategy, setPromptStrategy] = useState('strategy-a-strict-socratic');

  // Flagged Content List
  const [flaggedItems, setFlaggedItems] = useState([
    { id: 'fl-1', type: 'AI Output', context: 'Tutor Session #38', body: 'The student reported receiving answers directly without socratic guidance.', reason: 'Prompt Bypass Attempt', user: 'Sarah Spark' },
    { id: 'fl-2', type: 'Community Post', context: 'Algorithms Board', body: 'Checkout this bot program to auto-solve all quizzes and earn 5000 XP in 10 seconds.', reason: 'Anti-Gaming Policy', user: 'SpamMaster' }
  ]);

  useEffect(() => {
    setStore(getStore());
    const syncStore = () => setStore(getStore());
    window.addEventListener('eduverse_store_update', syncStore);
    return () => window.removeEventListener('eduverse_store_update', syncStore);
  }, []);

  if (!store) return null;

  const toggleFlag = (flagName: keyof typeof flags) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }));
  };

  const handleModerationAction = (itemId: string, approve: boolean) => {
    setFlaggedItems(prev => prev.filter(item => item.id !== itemId));
    alert(approve ? "Content approved and cleared." : "Content flagged deleted from Database.");
  };

  // Render Custom SVG Token Usage Graph (showing Claude vs OpenAI tokens consumed over 7 days)
  const renderTokenUsageChart = () => {
    const data = [
      { day: 'Mon', claude: 12000, openai: 8000 },
      { day: 'Tue', claude: 18000, openai: 12000 },
      { day: 'Wed', claude: 24000, openai: 15000 },
      { day: 'Thu', claude: 20000, openai: 18000 },
      { day: 'Fri', claude: 32000, openai: 25000 },
      { day: 'Sat', claude: 15000, openai: 9000 },
      { day: 'Sun', claude: 18000, openai: 14000 }
    ];

    const width = 500;
    const height = 180;
    const padding = 30;

    const maxVal = 40000;
    const pointsClaude = data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - (d.claude / maxVal) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const pointsOpenAI = data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - (d.openai / maxVal) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full bg-[#07070B] rounded-xl border border-white/5 p-4 stroke-[2.5]">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, idx) => {
          const y = height - padding - f * (height - 2 * padding);
          return (
            <g key={idx}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="4" />
              <text x={padding - 5} y={y + 3} textAnchor="end" className="fill-[#5A5A7A] text-[8px] font-mono">{(f * maxVal) / 1000}k</text>
            </g>
          );
        })}

        {/* Days label */}
        {data.map((d, i) => {
          const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
          return (
            <text key={i} x={x} y={height - 10} textAnchor="middle" className="fill-[#A0A0B8] text-[9px] font-mono">{d.day}</text>
          );
        })}

        {/* Areas */}
        <polyline points={pointsClaude} fill="none" stroke="#6C63FF" />
        <polyline points={pointsOpenAI} fill="none" stroke="#00D4AA" />

        {/* Legend */}
        <g transform="translate(350, 10)" className="text-[9px] font-mono fill-[#A0A0B8]">
          <circle cx="5" cy="5" r="4" fill="#6C63FF" />
          <text x="15" y="8" className="fill-white">Claude (Sonnet/Haiku)</text>
          <circle cx="120" cy="5" r="4" fill="#00D4AA" />
          <text x="130" y="8" className="fill-white">GPT-4o (Vision)</text>
        </g>
      </svg>
    );
  };

  return (
    <DashboardShell>
      {/* Admin Tabs */}
      <div className="flex border-b border-white/5 pb-1 mb-8 overflow-x-auto gap-4">
        {[
          { id: 'token_usage', name: 'Token Usage & Health', icon: Activity },
          { id: 'users', name: 'RBAC Controls', icon: Users },
          { id: 'moderation', name: 'Moderation Queue', icon: AlertTriangle },
          { id: 'ab_tests', name: 'Prompt A/B Testing & Flags', icon: Shield }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 pb-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === t.id ? 'border-[#6C63FF] text-white' : 'border-transparent text-[#A0A0B8] hover:text-white'}`}
            >
              <Icon className="h-4 w-4" /> {t.name}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-8">
        
        {/* Tab 1: Token Usage & System Health */}
        {activeTab === 'token_usage' && (
          <div className="space-y-8">
            {/* Health indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 flex flex-col justify-between">
                <span className="text-xs text-[#A0A0B8] font-mono">Response Latency (p50)</span>
                <span className="text-2xl font-extrabold text-[#00D4AA] mt-2">180ms</span>
                <span className="text-[10px] text-gray-400 mt-2 font-mono">Gateway API healthy</span>
              </div>
              <div className="glass-card p-6 flex flex-col justify-between">
                <span className="text-xs text-[#A0A0B8] font-mono">System Error Rate</span>
                <span className="text-2xl font-extrabold text-[#FF6B6B] mt-2">0.02%</span>
                <span className="text-[10px] text-gray-400 mt-2 font-mono">1 fail in 5,000 req</span>
              </div>
              <div className="glass-card p-6 flex flex-col justify-between">
                <span className="text-xs text-[#A0A0B8] font-mono">Active Sessions</span>
                <span className="text-2xl font-extrabold text-white mt-2">1,248</span>
                <span className="text-[10px] text-gray-400 mt-2 font-mono">Supabase Realtime WS</span>
              </div>
              <div className="glass-card p-6 flex flex-col justify-between">
                <span className="text-xs text-[#A0A0B8] font-mono">Total API cost today</span>
                <span className="text-2xl font-extrabold text-white mt-2">$24.82</span>
                <span className="text-[10px] text-[#00D4AA] mt-2 font-mono">Within budget</span>
              </div>
            </div>

            {/* Custom SVG Token chart */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Weekly Tokens Consumed</h3>
              {renderTokenUsageChart()}
            </div>

            {/* System Console logger */}
            <div className="glass-card p-6 font-mono text-xs text-[#00D4AA] bg-[#050508] border border-white/5 relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-[#5A5A7A]">
                <Database className="h-3.5 w-3.5" /> pgvector logs
              </div>
              <p className="text-white mb-3 font-semibold flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-[#6C63FF]" /> EduVerse AI OS Kernel logs:
              </p>
              <div className="space-y-1 text-gray-400 max-h-[150px] overflow-y-auto">
                <p>[2026-06-02 23:30:15] <span className="text-[#6C63FF]">SYS:</span> pgvector Cosine similarity match success on active session embeddings.</p>
                <p>[2026-06-02 23:31:02] <span className="text-[#00D4AA]">LLM:</span> Routed query "isPalindrome JS" to GPT-4o Code Optimizer.</p>
                <p>[2026-06-02 23:32:48] <span className="text-[#FF6B6B]">WARN:</span> Database CPU spiked to 42% during materialized leaderboard view refresh.</p>
                <p>[2026-06-02 23:35:10] <span className="text-[#6C63FF]">SYS:</span> Streak reset Cron Edge Function executed. 12 streams updated.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: RBAC Controls */}
        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[#A0A0B8] font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">Tier Plan</th>
                  <th className="px-6 py-4">Sign Up Date</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-medium">Shivam Kumar</td>
                  <td className="px-6 py-4"><span className="bg-[#6C63FF]/10 text-[#6C63FF] px-2 py-0.5 rounded font-mono">Student</span></td>
                  <td className="px-6 py-4 uppercase">Free</td>
                  <td className="px-6 py-4 text-[#A0A0B8]">June 01, 2026</td>
                  <td className="px-6 py-4"><button className="text-xs text-[#00D4AA] hover:underline font-semibold">Change Role</button></td>
                </tr>
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-medium">Dr. Helen Vance</td>
                  <td className="px-6 py-4"><span className="bg-[#00D4AA]/10 text-[#00D4AA] px-2 py-0.5 rounded font-mono">Teacher</span></td>
                  <td className="px-6 py-4 uppercase">Pro</td>
                  <td className="px-6 py-4 text-[#A0A0B8]">May 15, 2026</td>
                  <td className="px-6 py-4"><button className="text-xs text-[#00D4AA] hover:underline font-semibold">Change Role</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Moderation Queue */}
        {activeTab === 'moderation' && (
          <div className="grid grid-cols-1 gap-6">
            {flaggedItems.length > 0 ? (
              flaggedItems.map((item) => (
                <div key={item.id} className="glass-card p-6 border-l-4 border-l-[#FF6B6B] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#FF6B6B]/10 text-[#FF6B6B] text-[10px] font-mono px-2 py-0.5">{item.type}</span>
                      <span className="text-xs text-[#A0A0B8]">{item.context}</span>
                    </div>
                    <p className="text-sm font-semibold mt-3 text-white">"{item.body}"</p>
                    <div className="flex items-center gap-4 text-xs text-[#A0A0B8] mt-3">
                      <span>Reason: <b>{item.reason}</b></span>
                      <span>Author: <b>{item.user}</b></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button 
                      onClick={() => handleModerationAction(item.id, false)}
                      className="p-2 rounded-lg border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 hover:bg-[#FF6B6B]/15 text-[#FF6B6B] transition-colors"
                      title="Delete Content"
                    >
                      <Trash className="h-4.5 w-4.5" />
                    </button>
                    <button 
                      onClick={() => handleModerationAction(item.id, true)}
                      className="p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 transition-colors"
                      title="Clear Flag"
                    >
                      <Check className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic text-center py-12 glass-card">
                No items in the moderation queue. System safe!
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Prompt Strategy & Flags */}
        {activeTab === 'ab_tests' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Feature Flags */}
            <div className="lg:col-span-6 space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">System Feature Flags</h3>
                <div className="space-y-4 text-xs">
                  {Object.entries(flags).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="font-semibold text-gray-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <button onClick={() => toggleFlag(key as any)} className="text-gray-400 hover:text-white transition-colors">
                        {val ? <ToggleRight className="h-7 w-7 text-[#00D4AA]" /> : <ToggleLeft className="h-7 w-7 text-gray-600" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* A/B Prompt strategies */}
            <div className="lg:col-span-6 space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">A/B prompt strategy routing</h3>
                <p className="text-xs text-[#A0A0B8] mb-6">Change the LLM system instruction strategy deployed to Edge functions.</p>
                
                <div className="space-y-3">
                  {[
                    { id: 'strategy-a-strict-socratic', name: 'Strategy A: Strict Socratic (Sonnet)', desc: 'Asks guiding questions, blocks direct answer output unless 3 failures occur.' },
                    { id: 'strategy-b-direct-first', name: 'Strategy B: Direct First (Haiku)', desc: 'Gives high-level answers immediately, then tests concepts with MCQ quizzes.' },
                  ].map((strat) => (
                    <label 
                      key={strat.id} 
                      className={`block rounded-xl border p-4.5 cursor-pointer transition-all ${promptStrategy === strat.id ? 'bg-[#6C63FF]/10 border-[#6C63FF] text-white' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02] text-[#A0A0B8]'}`}
                    >
                      <input 
                        type="radio" 
                        name="promptStrategy" 
                        value={strat.id} 
                        checked={promptStrategy === strat.id}
                        onChange={(e) => setPromptStrategy(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{strat.name}</span>
                        {promptStrategy === strat.id && <span className="h-2 w-2 rounded-full bg-[#00D4AA]" />}
                      </div>
                      <p className="text-[10px] text-[#A0A0B8] mt-2">{strat.desc}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
