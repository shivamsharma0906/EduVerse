'use client';

import React, { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { getStore, updateStore } from '@/lib/store';
import { 
  Plus, Edit, Trash2, Sparkles, BookOpen, Users, 
  FileSpreadsheet, BarChart3, GraduationCap, CheckSquare, 
  Play, Download, ChevronRight, AlertTriangle, ArrowRight, Check
} from 'lucide-react';

export default function TeacherDashboard() {
  const [store, setStore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'builder' | 'generator' | 'grader' | 'insights'>('courses');
  
  // AI Lesson Generator Form States
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('undergraduate');
  const [duration, setDuration] = useState('45');
  const [standard, setStandard] = useState('ACM-IEEE CS-2023');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Auto Grader Form States
  const [essaySubmission, setEssaySubmission] = useState('');
  const [gradingRubric, setGradingRubric] = useState('Critical Analysis: 40%, Coding style: 40%, Syntax correctness: 20%');
  const [gradingResult, setGradingResult] = useState<any>(null);
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    setStore(getStore());
    const syncStore = () => setStore(getStore());
    window.addEventListener('eduverse_store_update', syncStore);
    return () => window.removeEventListener('eduverse_store_update', syncStore);
  }, []);

  if (!store) return null;

  // AI Lesson Plan Generator Trigger
  const handleGenerateLessonPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGeneratingPlan(true);
    setGeneratedPlan('');

    setTimeout(() => {
      setGeneratedPlan(`### Generated Lesson Plan: ${topic}
**Standards Mapping:** ${standard} (${gradeLevel})
**Duration:** ${duration} Minutes

#### 1. Learning Objectives (Bloom's Taxonomy)
- **Remembering:** Define core operations of ${topic}.
- **Understanding:** Explain time vs space trade-offs.
- **Applying:** Code a base implementation in Python.

#### 2. Schedule Breakdown
- **00:00 - 00:15:** Conceptual Slide Walkthrough (Hook).
- **00:15 - 00:30:** Live interactive demo & mathematical equations ($O(f(n))$).
- **00:30 - 00:45:** Student hands-on assessment.

#### 3. Homework Assignments
- Implement optimal search optimization using ${topic}.`);
      setIsGeneratingPlan(false);
    }, 1500);
  };

  // AI Rubric Grader Trigger
  const handleGraderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!essaySubmission) return;

    setIsGrading(true);
    setGradingResult(null);

    setTimeout(() => {
      setGradingResult({
        score: 84,
        feedback: `### AI Evaluation Report
**Score:** 84 / 100

#### Breakdown based on Rubric:
1. **Critical Analysis (35/40):** Strong explanation of recursive depth limits. Good analysis of stack frames.
2. **Coding Style (32/40):** Variables names are descriptive. Indentation is consistent. Missing comments on base case helper functions.
3. **Syntax Correctness (17/20):** Correct execution. Found 1 minor redundant pointer assignment.

**Intervention Suggestion:** Direct student to complete the lesson "Recursion Depth & Space complexity".`,
      });
      setIsGrading(false);
    }, 1500);
  };

  // Mock Student Roster Data
  const studentsRoster = [
    { name: 'Alice Dev', score: '95%', watchRate: '98%', risk: false, engagement: 'High' },
    { name: 'Alex Math', score: '88%', watchRate: '92%', risk: false, engagement: 'High' },
    { name: 'Sarah Spark', score: '76%', watchRate: '80%', risk: false, engagement: 'Medium' },
    { name: 'John Slow', score: '52%', watchRate: '45%', risk: true, engagement: 'Low' },
    { name: 'Beta Coder', score: '91%', watchRate: '85%', risk: false, engagement: 'High' }
  ];

  return (
    <DashboardShell>
      {/* Teacher Tabs Bar */}
      <div className="flex border-b border-white/5 pb-1 mb-8 overflow-x-auto gap-4">
        {[
          { id: 'courses', name: 'My Courses', icon: BookOpen },
          { id: 'builder', name: 'AI Lesson Generator', icon: Sparkles },
          { id: 'generator', name: 'Student Roster', icon: Users },
          { id: 'grader', name: 'Auto-Grader Panel', icon: CheckSquare },
          { id: 'insights', name: 'Student Risk Insights', icon: AlertTriangle }
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

      {/* Tab Panels */}
      <div className="space-y-6">

        {/* 1. Courses List Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {store.courses.map((course: any) => (
              <div key={course.id} className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <span className="text-[10px] font-mono capitalize rounded bg-white/5 px-2 py-0.5 text-gray-400">{course.difficulty}</span>
                  </div>
                  <p className="text-xs text-[#A0A0B8] mt-3 leading-relaxed">{course.description}</p>
                  
                  {/* Modules count */}
                  <div className="mt-6 space-y-2">
                    <p className="text-xs font-semibold text-white">Course Modules:</p>
                    {course.modules.map((mod: any) => (
                      <div key={mod.id} className="flex items-center justify-between text-xs text-[#A0A0B8] bg-white/[0.01] px-3 py-2 rounded-lg border border-white/5">
                        <span>{mod.title}</span>
                        <span className="font-mono">{mod.lessons.length} lessons</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex gap-3 justify-end">
                  <button className="text-xs font-semibold border border-white/10 hover:bg-white/5 rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5">
                    <Edit className="h-3.5 w-3.5" /> Modify
                  </button>
                  <button className="text-xs font-semibold bg-[#6C63FF] hover:bg-[#5b52eb] rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Add Module
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. AI Lesson Plan Builder Generator */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <form onSubmit={handleGenerateLessonPlan} className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6C63FF] mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> AI Lesson Plan Generator
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Lesson Topic / Concept</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dijkstra Shortest Path"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#6C63FF] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Grade Level</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                    >
                      <option value="k-12">K-12 Grade</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="postgraduate">Postgraduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Duration (mins)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Curriculum Standard Mapping</label>
                  <input
                    type="text"
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingPlan}
                  className="w-full rounded-lg bg-[#6C63FF] hover:bg-[#5b52eb] py-3 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  {isGeneratingPlan ? 'Generating...' : 'Generate Plan'} <Sparkles className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-card p-6 h-full min-h-[300px] flex flex-col justify-between">
                <div className="prose prose-invert text-xs max-w-none">
                  {generatedPlan ? (
                    <div className="space-y-4">
                      <div className="text-xs font-mono text-[#00D4AA] flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Check className="h-4 w-4" /> AI Lesson Plan generated standard mapped.
                      </div>
                      <div className="whitespace-pre-wrap font-mono leading-relaxed bg-white/[0.01] border border-white/5 p-4 rounded-xl text-gray-300">
                        {generatedPlan}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-20">
                      Configure constraints and click Generate to build AI curriculum maps...
                    </div>
                  )}
                </div>

                {generatedPlan && (
                  <div className="mt-8 flex gap-3 justify-end pt-4 border-t border-white/5">
                    <button className="text-xs font-semibold border border-white/10 hover:bg-white/5 rounded-lg px-4 py-2 transition-colors">
                      Copy Text
                    </button>
                    <button className="text-xs font-semibold bg-[#00D4AA] hover:bg-[#00b994] text-black rounded-lg px-4 py-2 transition-colors">
                      Publish to Course Modules
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. Students Roster Panel */}
        {activeTab === 'generator' && (
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Student Enrollment & Progress Metrics</h3>
              <button className="text-xs font-semibold border border-white/10 hover:bg-white/5 rounded-lg px-3.5 py-1.5 transition-all">
                Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-[#A0A0B8] font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Assessment Avg</th>
                    <th className="px-6 py-3.5">Video watch %</th>
                    <th className="px-6 py-3.5">Engagement Status</th>
                    <th className="px-6 py-3.5">Risk Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {studentsRoster.map((s, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4.5 font-medium">{s.name}</td>
                      <td className="px-6 py-4.5 font-mono">{s.score}</td>
                      <td className="px-6 py-4.5 font-mono">{s.watchRate}</td>
                      <td className="px-6 py-4.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.engagement === 'High' ? 'bg-emerald-500/10 text-emerald-400' : s.engagement === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                          {s.engagement}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        {s.risk ? (
                          <span className="flex items-center gap-1 text-[#FF6B6B] font-semibold animate-pulse">
                            <AlertTriangle className="h-4 w-4" /> At Risk
                          </span>
                        ) : (
                          <span className="text-[#A0A0B8]">Good</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Auto Grader Panel */}
        {activeTab === 'grader' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <form onSubmit={handleGraderSubmit} className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#00D4AA] flex items-center gap-1.5">
                  <CheckSquare className="h-4.5 w-4.5" /> AI Rubric Auto-Grader
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Grading Rubric Criteria Weight</label>
                  <input
                    type="text"
                    value={gradingRubric}
                    onChange={(e) => setGradingRubric(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Student Submission Draft (Essay/Code)</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Paste student submission here..."
                    value={essaySubmission}
                    onChange={(e) => setEssaySubmission(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#6C63FF] focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGrading}
                  className="w-full rounded-lg bg-[#00D4AA] hover:bg-[#00b994] text-black py-3 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  {isGrading ? 'Grading...' : 'Grade Submission'} <Sparkles className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="lg:col-span-6">
              <div className="glass-card p-6 h-full min-h-[350px] flex flex-col justify-between">
                <div className="prose prose-invert text-xs">
                  {gradingResult ? (
                    <div className="space-y-4">
                      <div className="text-xs font-mono text-[#00D4AA] flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Check className="h-4 w-4" /> Assessment Grade Completed
                      </div>
                      <div className="whitespace-pre-wrap font-mono leading-relaxed bg-white/[0.01] border border-white/5 p-4 rounded-xl text-gray-300">
                        {gradingResult.feedback}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-24">
                      Input submission details and submit to trigger LLM Auto-grading...
                    </div>
                  )}
                </div>

                {gradingResult && (
                  <div className="mt-8 flex gap-3 justify-end pt-4 border-t border-white/5">
                    <button className="text-xs font-semibold border border-white/10 hover:bg-white/5 rounded-lg px-4 py-2 transition-colors">
                      Edit Grade Manual
                    </button>
                    <button className="text-xs font-semibold bg-[#6C63FF] hover:bg-[#5b52eb] rounded-lg px-4 py-2 transition-colors">
                      Release to Student
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. Student Risk Insights */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Alert Card */}
              <div className="relative overflow-hidden rounded-2xl border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 p-6">
                <h3 className="text-sm font-semibold text-[#FF6B6B] flex items-center gap-1.5">
                  <AlertTriangle className="h-4.5 w-4.5" /> High Risk Alert: John Slow
                </h3>
                <p className="text-xs text-[#A0A0B8] mt-3 leading-relaxed">
                  John has completed 0 modules this week. Engagement metrics are down 45% compared to the cohort average. Assessment average score is 52%.
                </p>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <span className="text-[10px] text-white font-mono bg-white/5 px-2 py-0.5 rounded">AI Intervention Tip:</span>
                  <p className="text-xs text-[#00D4AA] mt-2 italic">
                    "Send direct message offering Socratic guidance on Dijkstra algorithm. Suggest a 1-to-1 availability slot."
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="rounded-lg bg-[#FF6B6B] hover:bg-[#e05a5a] text-white px-4 py-2 text-xs font-semibold transition-colors">
                    Draft Message
                  </button>
                </div>
              </div>

              {/* Alert Card 2 */}
              <div className="relative overflow-hidden rounded-2xl border border-[#FFB800]/20 bg-[#FFB800]/5 p-6">
                <h3 className="text-sm font-semibold text-[#FFB800] flex items-center gap-1.5">
                  <AlertTriangle className="h-4.5 w-4.5" /> Medium Risk Alert: Sarah Spark
                </h3>
                <p className="text-xs text-[#A0A0B8] mt-3 leading-relaxed">
                  Sarah scored 62% on "Recursion complexity" quiz. Video watch rate is 80%, but learning pace indicates rapid question clicking.
                </p>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <span className="text-[10px] text-white font-mono bg-white/5 px-2 py-0.5 rounded">AI Intervention Tip:</span>
                  <p className="text-xs text-[#00D4AA] mt-2 italic">
                    "Assign the interactive 'Space vs Time Tradeoffs' visual simulator. Unlock custom badge 'Phoenix Return' potential."
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="rounded-lg bg-[#FFB800] hover:bg-[#e0a300] text-black px-4 py-2 text-xs font-semibold transition-colors">
                    Unlock Simulator
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
