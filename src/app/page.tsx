'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Code, GraduationCap, BookOpen, ShieldCheck, 
  ArrowRight, MessageSquare, Play, Users, Landmark 
} from 'lucide-react';
import { simulateAIResponseStream } from '@/lib/aiStream';

const typewriterPhrases = ['for students', 'for teachers', 'for institutions', 'for builders'];

export default function LandingPage() {
  const [typewriterText, setTypewriterText] = useState('for students');
  const [demoInput, setDemoInput] = useState('');
  const [demoStream, setDemoStream] = useState('');
  const [demoModel, setDemoModel] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % typewriterPhrases.length;
      setTypewriterText(typewriterPhrases[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim() || isStreaming) return;

    setIsStreaming(true);
    setDemoStream('');
    setDemoModel('');

    simulateAIResponseStream(demoInput, false, (text, done, model) => {
      setDemoStream(text);
      setDemoModel(model);
      if (done) {
        setIsStreaming(false);
      }
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F] font-sans selection:bg-[#6C63FF]/30">
      {/* Particle Grid Background */}
      <div className="absolute inset-0 particle-grid opacity-30 pointer-events-none" />
      
      {/* Top Navigation */}
      <header className="relative z-10 flex h-20 items-center justify-between px-6 max-w-7xl mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] shadow-[0_0_15px_rgba(108,99,255,0.4)]">
            <Code className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-[#A0A0B8] bg-clip-text text-transparent">EduVerse AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A0A0B8]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="relative group overflow-hidden rounded-xl bg-[#6C63FF] px-4.5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-[#6C63FF]/30 transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-[#00D4AA] to-[#6C63FF] transition-transform duration-500" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00D4AA]/20 bg-[#00D4AA]/5 text-xs font-mono text-[#00D4AA] mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>EduVerse AI OS (v2.0) Active</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6">
            An AI Education Operating System <br />
            <span className="inline-block bg-gradient-to-r from-[#6C63FF] via-[#00D4AA] to-[#FF6B6B] bg-clip-text text-transparent min-w-[280px]">
              {typewriterText}
            </span>
          </h1>

          <p className="text-lg text-[#A0A0B8] max-w-xl mb-10 leading-relaxed">
            Unify personalized tutoring, curriculum mapping, gamified lessons, and talent discovery in one system. Highly aesthetic. Powered by Claude 3.5 & GPT-4o.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="rounded-xl bg-[#6C63FF] hover:bg-[#5b52eb] px-6 py-3.5 text-base font-semibold text-white transition-all shadow-lg shadow-[#6C63FF]/20 flex items-center gap-2">
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#demo" className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] px-6 py-3.5 text-base font-semibold text-white transition-all flex items-center gap-2">
              <Play className="h-4.5 w-4.5 text-[#00D4AA]" /> Try Demo Widget
            </a>
          </div>
        </div>

        {/* Live Demo Widget Side */}
        <div id="demo" className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] opacity-30 blur-xl animate-pulse" />
          <div className="relative glass-card p-6 flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF6B6B]" />
                <span className="h-3 w-3 rounded-full bg-[#FFB800]" />
                <span className="h-3 w-3 rounded-full bg-[#00D4AA]" />
              </div>
              <div className="text-xs font-mono text-[#A0A0B8]">
                {demoModel ? `Router -> ${demoModel}` : 'AI Tutor Gateway'}
              </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 text-sm font-mono scrollbar-thin">
              {demoStream ? (
                <div className="space-y-2">
                  <div className="text-xs text-[#00D4AA]">assistant:</div>
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-200">
                    {demoStream}
                  </div>
                </div>
              ) : (
                <div className="text-[#5A5A7A] italic h-full flex items-center justify-center text-center px-4">
                  Type a math, science, or coding question below to see AI routing and streaming in action...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleDemoSubmit} className="mt-auto">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="e.g. explain linear transformations"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  disabled={isStreaming}
                  className="w-full rounded-xl border border-white/10 bg-[#07070B] py-3.5 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:border-[#6C63FF] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !demoInput.trim()}
                  className="absolute right-2 p-2 rounded-lg bg-[#6C63FF] hover:bg-[#5b52eb] text-white disabled:bg-white/5 disabled:text-gray-500 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Social Proof Logos */}
      <section className="relative z-10 py-10 bg-[#07070B]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-around gap-8 text-[#5A5A7A] font-bold text-sm tracking-wider uppercase">
          <span className="flex items-center gap-2"><Landmark className="h-4.5 w-4.5" /> Stanford University</span>
          <span className="flex items-center gap-2"><Landmark className="h-4.5 w-4.5" /> MIT</span>
          <span className="flex items-center gap-2"><Landmark className="h-4.5 w-4.5" /> Harvard Edu</span>
          <span className="flex items-center gap-2"><Sparkles className="h-4.5 w-4.5" /> OpenAI Partner</span>
          <span className="flex items-center gap-2"><Users className="h-4.5 w-4.5" /> 500k+ Students</span>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">Unified Educational Infrastructure</h2>
          <p className="text-[#A0A0B8]">Four core pillars unifies learning, metrics, builder suites, and career pipelines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 glass-card-hover flex flex-col">
            <div className="h-12 w-12 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/30 flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-[#6C63FF]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Socratic AI Tutor</h3>
            <p className="text-sm text-[#A0A0B8] leading-relaxed mb-6">
              Claude 3.5 and GPT-4o powered tutoring that routes dynamically and implements active, socratic question guides with math and code rendering.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 glass-card-hover flex flex-col">
            <div className="h-12 w-12 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/30 flex items-center justify-center mb-6">
              <GraduationCap className="h-6 w-6 text-[#00D4AA]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Adaptive IRT Engine</h3>
            <p className="text-sm text-[#A0A0B8] leading-relaxed mb-6">
              Item Response Theory logic evaluates user ability coefficients on the fly to deliver the mathematically optimal next challenge.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 glass-card-hover flex flex-col">
            <div className="h-12 w-12 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center mb-6">
              <BookOpen className="h-6 w-6 text-[#FF6B6B]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Teacher Builder Suite</h3>
            <p className="text-sm text-[#A0A0B8] leading-relaxed mb-6">
              Drag-and-drop course designer, AI lesson planning generators, and custom rubrics auto-graders for essay and code submissions.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 bg-[#07070B]/40 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">Flexible Subscription Models</h2>
            <p className="text-[#A0A0B8]">Choose the plan built to optimize your potential.</p>
            
            {/* Toggle */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] p-1.5">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${billingPeriod === 'monthly' ? 'bg-[#6C63FF] text-white' : 'text-[#A0A0B8] hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${billingPeriod === 'annual' ? 'bg-[#6C63FF] text-white' : 'text-[#A0A0B8] hover:text-white'}`}
              >
                Annual (-20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="glass-card p-8 flex flex-col">
              <span className="text-xs font-mono text-[#A0A0B8] uppercase">Starter</span>
              <h3 className="text-2xl font-bold mt-2">Free</h3>
              <div className="mt-4 text-4xl font-extrabold">$0</div>
              <ul className="mt-8 space-y-3.5 text-sm text-[#A0A0B8] flex-1">
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> 20 AI Tutor messages/day</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> 5 free courses</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> Basic Career gap matrix</li>
              </ul>
              <Link href="/dashboard" className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] py-3 text-center text-sm font-semibold transition-all">
                Get Started
              </Link>
            </div>

            {/* Premium */}
            <div className="glass-card p-8 border-[#6C63FF]/30 relative flex flex-col bg-gradient-to-b from-[#6C63FF]/5 to-transparent">
              <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-[#6C63FF] px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">Popular</div>
              <span className="text-xs font-mono text-[#6C63FF] uppercase">Learner</span>
              <h3 className="text-2xl font-bold mt-2">Student Premium</h3>
              <div className="mt-4 text-4xl font-extrabold">
                {billingPeriod === 'monthly' ? '$12' : '$9.60'}<span className="text-sm font-normal text-[#A0A0B8]">/mo</span>
              </div>
              <ul className="mt-8 space-y-3.5 text-sm text-[#A0A0B8] flex-1">
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> Unlimited AI Tutor messages</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> All course library access</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> 90-day learning roadmap</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> Verified certifications</li>
              </ul>
              <Link href="/dashboard" className="mt-8 rounded-xl bg-[#6C63FF] hover:bg-[#5b52eb] py-3 text-center text-sm font-semibold transition-all">
                Go Premium
              </Link>
            </div>

            {/* Pro */}
            <div className="glass-card p-8 flex flex-col">
              <span className="text-xs font-mono text-[#00D4AA] uppercase">Educator</span>
              <h3 className="text-2xl font-bold mt-2">Teacher Pro</h3>
              <div className="mt-4 text-4xl font-extrabold">
                {billingPeriod === 'monthly' ? '$29' : '$23.20'}<span className="text-sm font-normal text-[#A0A0B8]">/mo</span>
              </div>
              <ul className="mt-8 space-y-3.5 text-sm text-[#A0A0B8] flex-1">
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> Up to 500 managed students</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> AI lesson plan generator</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-[#00D4AA]" /> Auto-grader and rubrics</li>
              </ul>
              <Link href="/dashboard" className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] py-3 text-center text-sm font-semibold transition-all">
                Try Educator Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 text-center text-sm text-[#5A5A7A]">
        <p>© 2026 EduVerse AI Inc. Built using Next.js 15 and Framer Motion.</p>
      </footer>
    </div>
  );
}
