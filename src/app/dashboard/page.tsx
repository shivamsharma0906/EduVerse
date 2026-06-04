'use client';

import React, { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { getStore, awardXpToUser } from '@/lib/store';
import { xpToLevel, xpForLevel } from '@/lib/gamification';
import { 
  CheckCircle, Play, Calendar, BrainCircuit, Sparkles, 
  Clock, ArrowRight, Award, Compass, BookOpen, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [store, setStore] = useState<any>(null);
  const [completedToday, setCompletedToday] = useState(false);

  useEffect(() => {
    setStore(getStore());
    const syncStore = () => setStore(getStore());
    window.addEventListener('eduverse_store_update', syncStore);
    return () => window.removeEventListener('eduverse_store_update', syncStore);
  }, []);

  if (!store) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#6C63FF]" />
      </div>
    );
  }

  // Handle mock lesson complete to award XP dynamically
  const handleQuickStudy = (lessonId: string, title: string) => {
    const { xpEarned, newLevelReached, badgesEarned } = awardXpToUser(
      50, 
      1.5, 
      false, 
      'complete_lesson'
    );
    
    // Toggle completed state to trigger render
    setCompletedToday(true);
    window.dispatchEvent(new Event('eduverse_store_update'));

    alert(`Lesson Completed! 🚀 You earned ${xpEarned} XP! ${newLevelReached ? '🎉 LEVEL UP!' : ''}`);
  };

  const level = xpToLevel(store.gamification.xp_total);
  const nextLvlXp = xpForLevel(level + 1);

  // 1. Skill radar calculations (8 domains)
  const skillsData = [
    { name: 'Algorithms', score: store.skills['computer-science']?.score || 400 },
    { name: 'Math Algebra', score: store.skills['mathematics']?.score || 300 },
    { name: 'Quantum Physics', score: store.skills['quantum-physics']?.score || 150 },
    { name: 'Bio Molecular', score: store.skills['molecular-biology']?.score || 100 },
    { name: 'Systems Design', score: 350 },
    { name: 'Web Engineering', score: 620 },
    { name: 'Data Structures', score: 480 },
    { name: 'Cognitive Science', score: 200 }
  ];

  // Draw custom SVG Radar Chart
  const renderRadarChart = () => {
    const width = 240;
    const height = 240;
    const cx = width / 2;
    const cy = height / 2;
    const r = 80;
    const numPoints = skillsData.length;

    // Grid circles
    const gridCircles = [0.2, 0.4, 0.6, 0.8, 1.0].map((factor) => {
      const radius = r * factor;
      const points = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return points.join(' ');
    });

    // Outer grid axes & labels
    const axes = [];
    const labels = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      const xOuter = cx + r * Math.cos(angle);
      const yOuter = cy + r * Math.sin(angle);
      
      // Axis line
      axes.push(<line key={`axis-${i}`} x1={cx} y1={cy} x2={xOuter} y2={yOuter} stroke="rgba(255,255,255,0.06)" />);
      
      // Text label position
      const labelDist = r + 22;
      const xLabel = cx + labelDist * Math.cos(angle);
      const yLabel = cy + labelDist * Math.sin(angle);
      let textAnchor: "start" | "end" | "middle" = 'middle';
      if (Math.cos(angle) > 0.1) textAnchor = 'start';
      else if (Math.cos(angle) < -0.1) textAnchor = 'end';

      labels.push(
        <text 
          key={`label-${i}`} 
          x={xLabel} 
          y={yLabel + 4} 
          textAnchor={textAnchor}
          className="fill-[#A0A0B8] text-[9px] font-semibold font-mono tracking-tight"
        >
          {skillsData[i].name}
        </text>
      );
    }

    // Filled score shape
    const shapePoints = skillsData.map((d, i) => {
      const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      // Normalise score from 0-1000 to factor 0.1 - 1.0
      const scoreFactor = Math.min(1.0, Math.max(0.1, d.score / 1000));
      const radius = r * scoreFactor;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="mx-auto" width={width} height={height}>
        {/* Grid backgrounds */}
        {gridCircles.map((pts, i) => (
          <polygon key={`grid-${i}`} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {axes}
        {/* Filled shape */}
        <polygon 
          points={shapePoints} 
          fill="rgba(108,99,255,0.15)" 
          stroke="#6C63FF" 
          strokeWidth="2" 
          className="transition-all duration-700 ease-in-out"
        />
        {/* Vertices */}
        {skillsData.map((d, i) => {
          const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
          const scoreFactor = Math.min(1.0, Math.max(0.1, d.score / 1000));
          const radius = r * scoreFactor;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          return (
            <circle 
              key={`vertex-${i}`} 
              cx={x} 
              cy={y} 
              r="4.5" 
              className="fill-[#00D4AA] stroke-[#0A0A0F] stroke-2 shadow-lg"
            />
          );
        })}
        {labels}
      </svg>
    );
  };

  // 2. Heatmap Calendar Streak calculation (GitHub-style 30 grid boxes)
  const renderStreakCalendar = () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      // simulate intensity
      const activityDays = [1, 2, 3, 5, 8, 9, 12, 15, 16, 20, 22, 23, 27, 28, 29];
      const active = activityDays.includes(i + 1);
      return {
        day: i + 1,
        active,
        intensity: active ? (i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low') : 'none'
      };
    });

    return (
      <div className="grid grid-cols-6 gap-2 w-full max-w-[200px] mx-auto mt-4">
        {days.map((d) => {
          let bgClass = 'bg-white/5';
          if (d.intensity === 'low') bgClass = 'bg-[#6C63FF]/30';
          else if (d.intensity === 'medium') bgClass = 'bg-[#6C63FF]/60';
          else if (d.intensity === 'high') bgClass = 'bg-[#00D4AA]';

          return (
            <div 
              key={`day-${d.day}`} 
              title={`Day ${d.day}: ${d.active ? 'Activity recorded' : 'No activity'}`}
              className={`h-6 w-6 rounded-md ${bgClass} transition-all duration-300 hover:scale-110 cursor-pointer border border-white/5`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <DashboardShell>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Main Content Grid */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Today's Learning Queue */}
          <section className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Compass className="h-5 w-5 text-[#6C63FF]" /> Today's Learning Queue
                </h2>
                <p className="text-xs text-[#A0A0B8] mt-1">AI-recommended path optimized for your current ability θ</p>
              </div>
              <span className="text-[10px] font-mono rounded bg-white/5 px-2 py-0.5 text-gray-400">3 Lessons Selected</span>
            </div>

            <div className="space-y-4">
              {/* Queue Item 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:bg-white/[0.02] transition-all">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-[#6C63FF]/15 border border-[#6C63FF]/30 flex items-center justify-center mt-0.5">
                    <BrainCircuit className="h-5 w-5 text-[#6C63FF]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Understanding Big O Notation</h3>
                    <p className="text-xs text-[#A0A0B8] mt-0.5">Asymptotic Analysis & Big O • 45 mins</p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-0.5 rounded-full">Recommended (Skill overlap)</span>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickStudy('les-1-1', 'Understanding Big O Notation')}
                  className="self-end sm:self-center inline-flex items-center gap-1.5 rounded-lg bg-[#6C63FF] hover:bg-[#5b52eb] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  Start <Play className="h-3.5 w-3.5 fill-current" />
                </button>
              </div>

              {/* Queue Item 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:bg-white/[0.02] transition-all">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-[#00D4AA]/15 border border-[#00D4AA]/30 flex items-center justify-center mt-0.5">
                    <BookOpen className="h-5 w-5 text-[#00D4AA]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Space vs Time Tradeoffs</h3>
                    <p className="text-xs text-[#A0A0B8] mt-0.5">Asymptotic Analysis & Big O • Video lesson • 20 mins</p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">Next up</span>
                  </div>
                </div>
                <Link
                  href="/tutor"
                  className="self-end sm:self-center inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  Discuss <Sparkles className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Queue Item 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:bg-white/[0.02] transition-all">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center mt-0.5">
                    <Award className="h-5 w-5 text-[#FF6B6B]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Linear Matrix Quiz (Adaptive IRT)</h3>
                    <p className="text-xs text-[#A0A0B8] mt-0.5">Linear Algebra & Quantum Prep • 3 Questions</p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-[#FF6B6B] bg-[#FF6B6B]/10 px-2 py-0.5 rounded-full">IRT Adaptive Test</span>
                  </div>
                </div>
                <Link
                  href="/career"
                  className="self-end sm:self-center inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  Analyze <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Activity feed & Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-[#00D4AA]" /> Recent Activity
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 border-l border-white/5 pl-4 relative">
                  <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#6C63FF]" />
                  <div>
                    <p className="font-medium">Completed: understanding-big-o-notation</p>
                    <span className="text-xs text-[#A0A0B8] block">Today, 4:12 PM</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-l border-white/5 pl-4 relative">
                  <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#00D4AA]" />
                  <div>
                    <p className="font-medium">Earned Badge: Starter Flame (3-Day Streak)</p>
                    <span className="text-xs text-[#A0A0B8] block">Yesterday, 9:30 AM</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-l border-white/5 pl-4 relative">
                  <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#FF6B6B]" />
                  <div>
                    <p className="font-medium">Posted Forum discussion: "Choosing optimal pivot for QuickSort"</p>
                    <span className="text-xs text-[#A0A0B8] block">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Assessments */}
            <div className="glass-card p-6">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-[#FF6B6B]" /> Upcoming Assessments
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <div>
                    <p className="font-medium">Recursion Depth & Space complexity</p>
                    <span className="text-xs text-[#A0A0B8]">Due tomorrow • 10 questions</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-0.5 rounded-full block">Est: 85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <div>
                    <p className="font-medium">Quantum Transformations Final</p>
                    <span className="text-xs text-[#A0A0B8]">Due June 12 • 20 questions</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#FFB800] bg-[#FFB800]/10 px-2 py-0.5 rounded-full block">Est: 72%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Widgets Column */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Skill Radar Chart */}
          <section className="glass-card p-6 text-center">
            <h3 className="text-base font-bold mb-2 flex items-center justify-center gap-2">
              <Award className="h-4.5 w-4.5 text-[#FFB800]" /> Skill Radar Chart
            </h3>
            <p className="text-xs text-[#A0A0B8] mb-4">Estimated ability metrics (θ) across domains</p>
            {renderRadarChart()}
          </section>

          {/* Streak tracker & Daily heat */}
          <section className="glass-card p-6">
            <h3 className="text-base font-bold mb-2 text-center flex items-center justify-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-[#FF6B6B]" /> Learning Streak Heatmap
            </h3>
            <p className="text-xs text-[#A0A0B8] text-center mb-4">Last 30 days active lessons completed</p>
            {renderStreakCalendar()}
          </section>

          {/* AI Insight Card */}
          <section className="relative overflow-hidden rounded-2xl border border-[#00D4AA]/20 bg-[#00D4AA]/5 p-6">
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-24 h-24 bg-[#00D4AA]/10 blur-2xl rounded-full" />
            <h3 className="text-sm font-semibold text-[#00D4AA] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Personal AI Insight
            </h3>
            <p className="text-xs text-[#A0A0B8] mt-3 leading-relaxed">
              "Your performance in <b>Recursion Complexity</b> increased by 23% this week. You respond to binary search trees questions 4.5 seconds faster on average than standard students."
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-[#5A5A7A] font-mono">
              Consolidated from last 3 sessions
            </div>
          </section>
        </div>

      </div>
    </DashboardShell>
  );
}
