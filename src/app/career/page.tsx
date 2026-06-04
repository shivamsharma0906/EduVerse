'use client';

import React, { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { getStore, updateStore } from '@/lib/store';
import { 
  Briefcase, Sparkles, CheckCircle2, ChevronRight, Award, 
  Map, FileText, Search, ArrowUpRight, GraduationCap, Percent, Check
} from 'lucide-react';

export default function CareerCenter() {
  const [store, setStore] = useState<any>(null);
  const [targetJob, setTargetJob] = useState('Senior AI Engineer');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  // Resume builder states
  const [resumeData, setResumeData] = useState<any>(null);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [atsScore, setAtsScore] = useState(72);
  const [atsSuggestions, setAtsSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setStore(getStore());
    const syncStore = () => {
      const s = getStore();
      setStore(s);
      if (s) {
        setResumeData(s.resumeData);
      }
    };
    window.addEventListener('eduverse_store_update', syncStore);
    return () => window.removeEventListener('eduverse_store_update', syncStore);
  }, []);

  useEffect(() => {
    if (store && !resumeData) {
      setResumeData(store.resumeData);
    }
  }, [store]);

  if (!store || !resumeData) return null;

  // Gap analysis based on selected job role
  const getSkillsRequired = () => {
    const job = store.jobs.find((j: any) => j.title === targetJob);
    return job ? job.skillsRequired : ['Next.js', 'TypeScript', 'PostgreSQL'];
  };

  const requiredSkills = getSkillsRequired();

  const getSkillScores = () => {
    return requiredSkills.map((skill: string) => {
      // Find matching current skill score from store
      let currentScore = 100; // default for unknown
      if (skill === 'Algorithms') currentScore = store.skills['computer-science']?.score || 450;
      else if (skill === 'Linear Algebra') currentScore = store.skills['mathematics']?.score || 320;
      else if (skill === 'TypeScript' || skill === 'Next.js' || skill === 'React') currentScore = 600; // simulated high intermediate
      
      const gap = Math.max(0, 800 - currentScore); // target is 800 (mastery)
      const priority = gap > 400 ? 'High' : gap > 200 ? 'Medium' : 'Low';
      
      return {
        name: skill,
        current: currentScore,
        target: 800,
        gap,
        priority
      };
    });
  };

  const skillsAnalysis = getSkillScores();

  // ATS Optimization score calculations
  const calculateATSScore = (data: any) => {
    let score = 50;
    const suggestions: string[] = [];

    if (data.skills.includes('Next.js')) score += 10;
    else suggestions.push("Add Next.js keyword to skills for web frameworks.");

    if (data.skills.includes('TypeScript')) score += 10;
    else suggestions.push("Add TypeScript keyword to align with framework standards.");

    if (data.skills.includes('Algorithms')) score += 10;
    else suggestions.push("Add Algorithms keyword to pass basic computer science filters.");

    if (data.experience.length > 100) score += 15;
    else suggestions.push("Expand experience descriptions with quantifiable metrics (e.g. Optimized SQL by 20%).");

    if (data.education.length > 50) score += 5;

    setAtsScore(score);
    setAtsSuggestions(suggestions);
  };

  const handleUpdateResume = (field: string, value: any) => {
    const updated = { ...resumeData, [field]: value };
    setResumeData(updated);
    calculateATSScore(updated);
  };

  const handleSaveResume = () => {
    setIsSavingResume(true);
    updateStore((s) => {
      s.resumeData = resumeData;
    });
    window.dispatchEvent(new Event('eduverse_store_update'));
    setTimeout(() => {
      setIsSavingResume(false);
      alert("Resume saved and optimized in local profile database.");
    }, 800);
  };

  // 90-Day learning path generator
  const handleGenerateRoadmap = () => {
    setIsGeneratingRoadmap(true);
    setRoadmap(null);
    setShowRoadmap(true);

    setTimeout(() => {
      setRoadmap([
        { day: 'Days 1 - 30: Foundation', task: 'Complete math graph and vector space transformations. Read the course Linear Algebra.', details: 'Target: Matrix transformations coordinates ($T(x) = Ax$).' },
        { day: 'Days 31 - 60: Implementation', task: 'Complete interactive dynamic programming memoization. Take Algorithms assessment.', details: 'Target: Big O worst-case QuickSort optimizations.' },
        { day: 'Days 61 - 90: Interview prep', task: 'Build fully completed socratic AI portfolio pieces. Apply via recruit profiles.', details: 'Target: ATS resume matching rate 95%.' }
      ]);
      setIsGeneratingRoadmap(false);
    }, 1500);
  };

  return (
    <DashboardShell>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Gap Analyzer and Roadmaps */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* Target Job selection */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-[#6C63FF]" /> Skill Gap Analyzer
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Select Target Job Title</label>
                <select
                  value={targetJob}
                  onChange={(e) => {
                    setTargetJob(e.target.value);
                    setShowRoadmap(false);
                    setRoadmap(null);
                  }}
                  className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                >
                  {store.jobs.map((j: any) => (
                    <option key={j.id} value={j.title}>{j.title} ({j.company})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleGenerateRoadmap}
                disabled={isGeneratingRoadmap}
                className="w-full sm:w-auto rounded-lg bg-[#6C63FF] hover:bg-[#5b52eb] px-6 py-2.5 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                Generate 90-Day Roadmap <Sparkles className="h-4 w-4" />
              </button>
            </div>

            {/* Gap Matrix */}
            <div className="mt-6 space-y-3.5">
              <p className="text-xs font-semibold text-[#A0A0B8]">Job Skill Gap Matrix:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skillsAnalysis.map((sa: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{sa.name}</span>
                        <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded ${sa.priority === 'High' ? 'bg-[#FF6B6B]/15 text-[#FF6B6B]' : sa.priority === 'Medium' ? 'bg-[#FFB800]/15 text-[#FFB800]' : 'bg-[#00D4AA]/15 text-[#00D4AA]'}`}>
                          {sa.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-[#A0A0B8] mt-3">
                        <span>Current: <b>{sa.current}</b></span>
                        <span>Target: <b>{sa.target}</b></span>
                      </div>
                    </div>
                    
                    {/* Gap bar */}
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${sa.priority === 'High' ? 'bg-[#FF6B6B]' : 'bg-[#6C63FF]'} transition-all`}
                          style={{ width: `${Math.min(100, (sa.current / sa.target) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 90-Day Roadmap View */}
          {showRoadmap && (
            <div className="glass-card p-6 relative">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#6C63FF] mb-4 flex items-center gap-1.5">
                <Map className="h-4.5 w-4.5" /> Generated 90-day learning roadmap
              </h3>
              
              {isGeneratingRoadmap ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#6C63FF] mx-auto mb-3" />
                  <p className="text-xs text-[#A0A0B8]">Claude is creating custom curriculum steps...</p>
                </div>
              ) : (
                <div className="space-y-6 font-mono text-xs">
                  {roadmap?.map((step: any, idx: number) => (
                    <div key={idx} className="flex gap-4 relative">
                      {idx !== roadmap.length - 1 && (
                        <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-white/5" />
                      )}
                      <div className="h-4.5 w-4.5 rounded-full bg-[#00D4AA]/25 border border-[#00D4AA] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-[#00D4AA]" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-white">{step.day}</h4>
                        <p className="text-gray-300 leading-relaxed">{step.task}</p>
                        <span className="text-[10px] text-gray-500 block">{step.details}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: ATS Resume Builder */}
        <div className="xl:col-span-5 space-y-8">
          
          <div className="glass-card p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#00D4AA]" /> Resume Builder
              </h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold ${atsScore > 80 ? 'bg-[#00D4AA]/15 text-[#00D4AA]' : 'bg-[#FFB800]/15 text-[#FFB800]'}`}>
                ATS Score: {atsScore}%
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#A0A0B8] mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.fullName}
                  onChange={(e) => handleUpdateResume('fullName', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A0A0B8] mb-1">Contact Email</label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => handleUpdateResume('email', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A0A0B8] mb-1">Skills Keywords (comma separated)</label>
                <input
                  type="text"
                  value={resumeData.skills.join(', ')}
                  onChange={(e) => handleUpdateResume('skills', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A0A0B8] mb-1">Professional Experience Summary</label>
                <textarea
                  rows={4}
                  value={resumeData.experience}
                  onChange={(e) => handleUpdateResume('experience', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2 text-xs text-white focus:border-[#6C63FF] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A0A0B8] mb-1">Education Background</label>
                <input
                  type="text"
                  value={resumeData.education}
                  onChange={(e) => handleUpdateResume('education', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                />
              </div>
            </div>

            {/* ATS Optimization suggestions list */}
            {atsSuggestions.length > 0 && (
              <div className="rounded-xl bg-[#FFB800]/5 border border-[#FFB800]/25 p-3.5 text-xs text-[#FFB800] space-y-1">
                <span className="font-semibold block mb-1">ATS Optimization Tips:</span>
                {atsSuggestions.map((s, idx) => (
                  <p key={idx} className="leading-relaxed font-mono">• {s}</p>
                ))}
              </div>
            )}

            <button
              onClick={handleSaveResume}
              disabled={isSavingResume}
              className="w-full rounded-lg bg-[#00D4AA] hover:bg-[#00b994] text-black py-2.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              {isSavingResume ? 'Saving...' : 'Save & Optimize Profile'}
            </button>
          </div>

        </div>

      </div>
    </DashboardShell>
  );
}
