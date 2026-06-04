'use client';

import React, { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { getStore, updateStore } from '@/lib/store';
import { 
  Settings, User, Accessibility, Eye, HelpCircle, 
  Download, Trash, Check, Bell, Sparkles, Sliders
} from 'lucide-react';

export default function SettingsPage() {
  const [store, setStore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'accessibility' | 'learning' | 'privacy'>('accessibility');

  // Form states
  const [fullName, setFullName] = useState('');
  const [learningPace, setLearningPace] = useState<'relaxed' | 'balanced' | 'intensive'>('balanced');
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ttsLang, setTtsLang] = useState('en-US');
  const [memoryOptOut, setMemoryOptOut] = useState(false);

  useEffect(() => {
    const s = getStore();
    setStore(s);
    if (s) {
      setFullName(s.user.full_name);
      setLearningPace(s.settings.learningPace);
      setDyslexiaFont(s.settings.dyslexiaFont);
      setHighContrast(s.settings.highContrast);
      setReducedMotion(s.settings.reducedMotion);
      setTtsLang(s.settings.ttsLanguage);
    }
  }, []);

  if (!store) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore((s) => {
      s.user.full_name = fullName;
    });
    window.dispatchEvent(new Event('eduverse_store_update'));
    alert("Profile saved successfully.");
  };

  // Immediate toggle effect for accessibility switches
  const handleAccessibilityToggle = (key: 'dyslexiaFont' | 'highContrast' | 'reducedMotion', val: boolean) => {
    if (key === 'dyslexiaFont') setDyslexiaFont(val);
    if (key === 'highContrast') setHighContrast(val);
    if (key === 'reducedMotion') setReducedMotion(val);

    updateStore((s) => {
      s.settings[key] = val;
    });

    // Notify LayoutWrappers to adjust classlists immediately
    window.dispatchEvent(new Event('eduverse_settings_change'));
    window.dispatchEvent(new Event('eduverse_store_update'));
  };

  const handlePaceChange = (pace: 'relaxed' | 'balanced' | 'intensive') => {
    setLearningPace(pace);
    updateStore((s) => {
      s.settings.learningPace = pace;
    });
    window.dispatchEvent(new Event('eduverse_store_update'));
  };

  // GDPR Data Export utility
  const handleGDPRDataExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eduverse_gdpr_data_${store.user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <DashboardShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Settings Sub Tabs */}
        <div className="lg:col-span-3 flex flex-col space-y-2">
          {[
            { id: 'profile', name: 'Profile & Identity', icon: User },
            { id: 'accessibility', name: 'Accessibility Options', icon: Accessibility },
            { id: 'learning', name: 'Learning Preferences', icon: Sliders },
            { id: 'privacy', name: 'GDPR Privacy & Data', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-3 transition-all border ${activeTab === tab.id ? 'bg-[#6C63FF]/10 border-[#6C63FF] text-white' : 'border-transparent text-[#A0A0B8] hover:text-white'}`}
              >
                <Icon className="h-4.5 w-4.5" /> {tab.name}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Forms Panel */}
        <div className="lg:col-span-9">
          <div className="glass-card p-8">

            {/* Profile Tab Panel */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">Profile Details</h3>
                  <p className="text-xs text-[#A0A0B8]">Update your personal email, profile details, and account avatars.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={store.user.avatar_url} alt="Avatar" className="h-16 w-16 rounded-full border border-[#6C63FF]/30 object-cover" />
                    <div>
                      <button type="button" className="text-xs font-semibold bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 border border-white/5 transition-all">Change Avatar</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full max-w-md rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Registered Email</label>
                    <input
                      type="email"
                      disabled
                      value={store.user.email}
                      className="w-full max-w-md rounded-lg border border-white/5 bg-[#07070B]/50 px-3.5 py-2.5 text-xs text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button type="submit" className="rounded-lg bg-[#6C63FF] hover:bg-[#5b52eb] px-6 py-2.5 text-xs font-semibold text-white transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Accessibility Tab Panel */}
            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">Accessibility & Usability Settings</h3>
                  <p className="text-xs text-[#A0A0B8]">Optimise display contrast, reading typography, and animations for your learning comfort.</p>
                </div>

                <div className="space-y-4">
                  {/* Dyslexia font toggle */}
                  <div className="flex items-center justify-between p-4.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-white">OpenDyslexic Typography Option</h4>
                      <p className="text-[10px] text-[#A0A0B8] mt-1.5 max-w-md">Swaps core UI fonts with weighted letter-spacing fallbacks to assist reading flow.</p>
                    </div>
                    <button
                      onClick={() => handleAccessibilityToggle('dyslexiaFont', !dyslexiaFont)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${dyslexiaFont ? 'bg-[#00D4AA]' : 'bg-white/10'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${dyslexiaFont ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* High contrast toggle */}
                  <div className="flex items-center justify-between p-4.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-white">High Contrast Assist</h4>
                      <p className="text-[10px] text-[#A0A0B8] mt-1.5 max-w-md">Increases visual border definitions and sets foregrounds to pure neon contrast specs.</p>
                    </div>
                    <button
                      onClick={() => handleAccessibilityToggle('highContrast', !highContrast)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${highContrast ? 'bg-[#00D4AA]' : 'bg-white/10'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${highContrast ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Reduced motion toggle */}
                  <div className="flex items-center justify-between p-4.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-white">Reduced Motion Settings</h4>
                      <p className="text-[10px] text-[#A0A0B8] mt-1.5 max-w-md">Disables secondary page transitions, active flame flashes, and custom slider rotations.</p>
                    </div>
                    <button
                      onClick={() => handleAccessibilityToggle('reducedMotion', !reducedMotion)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${reducedMotion ? 'bg-[#00D4AA]' : 'bg-white/10'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${reducedMotion ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* TTS Language */}
                  <div>
                    <label className="block text-xs font-semibold text-[#A0A0B8] mb-1.5">Text-to-Speech (TTS) Accent</label>
                    <select
                      value={ttsLang}
                      onChange={(e) => {
                        setTtsLang(e.target.value);
                        updateStore((s) => {
                          s.settings.ttsLanguage = e.target.value;
                        });
                        window.dispatchEvent(new Event('eduverse_store_update'));
                      }}
                      className="w-full max-w-xs rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white focus:border-[#6C63FF] focus:outline-none"
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="en-GB">English (Great Britain)</option>
                      <option value="es-ES">Spanish (Spain)</option>
                      <option value="fr-FR">French (France)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Preferences Panel */}
            {activeTab === 'learning' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">Learning Preference Parameters</h3>
                  <p className="text-xs text-[#A0A0B8]">Tune daily target metrics and adaptive AI pacing.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A0A0B8] mb-3">Adaptive Course Pacing</label>
                    <div className="grid grid-cols-3 gap-4 max-w-md">
                      {['relaxed', 'balanced', 'intensive'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePaceChange(p as any)}
                          className={`rounded-xl py-3 border text-xs font-semibold capitalize transition-all ${learningPace === p ? 'bg-[#6C63FF]/15 border-[#6C63FF] text-white' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02] text-[#A0A0B8]'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#6C63FF]/10 bg-[#6C63FF]/5 p-4.5 text-xs text-gray-300">
                    <p className="font-semibold text-white flex items-center gap-1.5 mb-1.5"><Sparkles className="h-4.5 w-4.5 text-[#6C63FF]" /> Adaptive Path Adjustments</p>
                    {learningPace === 'relaxed' && "Relaxed mode: Quizzes contain less difficulty scaling. IRT ability threshold increments at a slower rate."}
                    {learningPace === 'balanced' && "Balanced mode: Standard 3PL IRT model applies. Normal skill rating distributions."}
                    {learningPace === 'intensive' && "Intensive mode: Skips basic levels. Prompts target Bloom's taxonomy applying/evaluating structures."}
                  </div>
                </div>
              </div>
            )}

            {/* GDPR & Privacy Panel */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">GDPR Privacy & Account Deletion</h3>
                  <p className="text-xs text-[#A0A0B8]">Export or erase your learning analytics in full compliance with European DPAs.</p>
                </div>

                <div className="space-y-4">
                  {/* AI session memory opt out */}
                  <div className="flex items-center justify-between p-4.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Tutor Memory Retention</h4>
                      <p className="text-[10px] text-[#A0A0B8] mt-1.5 max-w-md">Allow Claude/GPT-4o to retrieve past session summaries for learning reinforcement.</p>
                    </div>
                    <button
                      onClick={() => setMemoryOptOut(!memoryOptOut)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!memoryOptOut ? 'bg-[#00D4AA]' : 'bg-white/10'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${!memoryOptOut ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={handleGDPRDataExport}
                      className="rounded-lg border border-[#00D4AA]/20 bg-[#00D4AA]/5 hover:bg-[#00D4AA]/15 text-[#00D4AA] px-4 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Download className="h-4 w-4" /> Export All Profile Data (JSON)
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 hover:bg-[#FF6B6B]/15 text-[#FF6B6B] px-4 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Trash className="h-4 w-4" /> Delete Account & Erasure Cascade
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
