'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardShell from '@/components/DashboardShell';
import MarkdownMathCode from '@/components/MarkdownMathCode';
import { getStore, updateStore, awardXpToUser } from '@/lib/store';
import { simulateAIResponseStream } from '@/lib/aiStream';
import { 
  Sparkles, Send, Mic, MicOff, Image, Paperclip, 
  HelpCircle, Search, Snail, CheckCircle2, AlertTriangle, 
  ChevronRight, PlusCircle, Check, X, ShieldCheck
} from 'lucide-react';

interface FileUpload {
  name: string;
  type: string;
  previewUrl?: string;
}

export default function AITutorPage() {
  const [store, setStore] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const [streamModel, setStreamModel] = useState('');
  const [socratic, setSocratic] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const activeStore = getStore();
    setStore(activeStore);
    setSocratic(activeStore.socraticMode);
    
    // Select first session or create one
    if (activeStore.tutorSessions.length > 0) {
      setSession(activeStore.tutorSessions[0]);
    } else {
      createNewSession(activeStore);
    }

    const syncStore = () => {
      const s = getStore();
      setStore(s);
      if (session) {
        const updatedSess = s.tutorSessions.find(ts => ts.id === session.id);
        if (updatedSess) setSession(updatedSess);
      }
    };
    window.addEventListener('eduverse_store_update', syncStore);
    return () => window.removeEventListener('eduverse_store_update', syncStore);
  }, [session?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, currentStream]);

  if (!store || !session) return null;

  function createNewSession(currentStore: any = store) {
    const newSess = {
      id: `sess-${Date.now()}`,
      subjectId: 'sub-cs',
      startedAt: new Date().toISOString(),
      messages: [
        { 
          id: `m-init-${Date.now()}`, 
          role: 'assistant', 
          content: 'Hello! I am your AI Socratic tutor. Choose a topic (Math, Computer Science, Biology) and let me guide you through the core concepts. What would you like to explore today?', 
          timestamp: new Date().toISOString(),
          modelUsed: 'Claude 3.5 Sonnet'
        }
      ]
    };

    updateStore((s) => {
      s.tutorSessions.unshift(newSess as any);
      s.activeSessionId = newSess.id;
    });
    setSession(newSess);
    window.dispatchEvent(new Event('eduverse_store_update'));
  }

  const handleSelectSession = (sessId: string) => {
    const selected = store.tutorSessions.find((s: any) => s.id === sessId);
    if (selected) setSession(selected);
  };

  // Simulated Voice recognition using browser Web Speech API
  const handleVoiceInput = () => {
    if (micActive) {
      setMicActive(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Simulating voice prompt...");
      setInput("Write a palindrome checker in JavaScript");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.lang = store.settings.ttsLanguage || 'en-US';
    rec.interimResults = false;

    rec.onstart = () => setMicActive(true);
    rec.onend = () => setMicActive(false);
    rec.onresult = (e: any) => {
      const speech = e.results[0][0].transcript;
      setInput(speech);
    };

    rec.start();
  };

  // Mock File Uploads
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile: FileUpload = {
        name: file.name,
        type: file.type,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      setUploadedFiles(prev => [...prev, newFile]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && uploadedFiles.length === 0) || isStreaming) return;

    const userMsgId = `m-user-${Date.now()}`;
    const userMsgContent = input;
    const userAttachments = uploadedFiles.map(f => ({ name: f.name, type: f.type, previewUrl: f.previewUrl }));

    // Update locally
    updateStore((s) => {
      const activeSess = s.tutorSessions.find(ts => ts.id === session.id);
      if (activeSess) {
        activeSess.messages.push({
          id: userMsgId,
          role: 'user',
          content: userMsgContent,
          timestamp: new Date().toISOString(),
          attachments: userAttachments
        } as any);
      }
    });

    setInput('');
    setUploadedFiles([]);
    window.dispatchEvent(new Event('eduverse_store_update'));

    // Trigger AI response streaming
    setIsStreaming(true);
    setCurrentStream('');
    setStreamModel('');

    simulateAIResponseStream(userMsgContent, socratic, (text, done, model, toolCall) => {
      setStreamModel(model);
      if (done) {
        setIsStreaming(false);
        updateStore((s) => {
          const activeSess = s.tutorSessions.find(ts => ts.id === session.id);
          if (activeSess) {
            activeSess.messages.push({
              id: `m-ai-${Date.now()}`,
              role: 'assistant',
              content: text,
              timestamp: new Date().toISOString(),
              modelUsed: model,
              toolCall
            } as any);
            activeSess.summary = text.slice(0, 100) + '...';
          }
        });
        window.dispatchEvent(new Event('eduverse_store_update'));
        
        // Award XP for Socratic active session chat message
        awardXpToUser(10, 1.0, false, 'complete_lesson');
      } else {
        setCurrentStream(text);
      }
    });
  };

  // Socratic switch trigger
  const handleSocraticToggle = () => {
    const nextVal = !socratic;
    setSocratic(nextVal);
    updateStore((s) => {
      s.socraticMode = nextVal;
    });
    window.dispatchEvent(new Event('eduverse_store_update'));
  };

  // Interactive Inline Quiz Solver
  const handleQuizAnswer = (quizData: any, selectedOption: string, messageId: string) => {
    const isCorrect = selectedOption === quizData.correctAnswer;
    
    // Show dynamic feedback & award XP
    if (isCorrect) {
      const { xpEarned } = awardXpToUser(25, 1.0, true, 'complete_quiz');
      alert(`Correct! 🎉 +${xpEarned} XP awarded!`);
    } else {
      alert(`Incorrect option. The correct answer was: "${quizData.correctAnswer}"`);
    }
    
    // Store that we answered
    updateStore((s) => {
      s.attemptedQuestions.push(quizData.questionId);
    });
    window.dispatchEvent(new Event('eduverse_store_update'));
  };

  // Client-side search filters
  const filteredSessions = store.tutorSessions.filter((s: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchesTopic = s.summary?.toLowerCase().includes(q);
    const matchesMsgs = s.messages.some((m: any) => m.content.toLowerCase().includes(q));
    return matchesTopic || matchesMsgs;
  });

  return (
    <DashboardShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)] overflow-hidden">
        
        {/* Left Sidebar: Session List */}
        <div className="lg:col-span-3 flex flex-col border-r border-white/5 pr-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#A0A0B8] uppercase tracking-wider">Tutor Sessions</h2>
            <button 
              onClick={() => createNewSession()}
              className="text-xs font-semibold text-[#00D4AA] hover:text-white flex items-center gap-1 transition-colors"
            >
              <PlusCircle className="h-4 w-4" /> New Session
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/5 bg-white/[0.02] pl-8.5 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-[#6C63FF] focus:outline-none"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
          </div>

          <div className="space-y-2 flex-1">
            {filteredSessions.map((s: any) => (
              <button
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={`w-full text-left rounded-xl p-3.5 border transition-all text-xs flex flex-col gap-1.5 ${session.id === s.id ? 'bg-[#6C63FF]/10 border-[#6C63FF] text-white' : 'border-white/5 bg-white/[0.01] text-[#A0A0B8] hover:bg-white/[0.02]'}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-white truncate max-w-[120px]">
                    {s.messages[1]?.content.slice(0, 15) || 'New Inquiry'}
                  </span>
                  <span className="text-[9px] text-[#5A5A7A] font-mono">
                    {new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[10px] text-[#A0A0B8] truncate w-full">
                  {s.summary || 'Starting context...'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel: Active Chat Room */}
        <div className="lg:col-span-9 flex flex-col h-full overflow-hidden">
          
          {/* Top Bar Options */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#00D4AA] border border-[#0A0A0F]" />
                <div className="h-9 w-9 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-[#6C63FF]" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Adaptive Socratic Guide</h3>
                <span className="text-[10px] text-[#00D4AA] font-mono flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Socratic Learning Active
                </span>
              </div>
            </div>

            {/* Socratic Mode Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#A0A0B8]">Socratic Mode</span>
              <button
                onClick={handleSocraticToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${socratic ? 'bg-[#6C63FF]' : 'bg-white/10'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${socratic ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 scrollbar-thin">
            {session.messages.map((m: any) => (
              <div key={m.id} className={`flex items-start gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role !== 'user' && (
                  <div className="h-8 w-8 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/30 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4.5 w-4.5 text-[#6C63FF]" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl p-4.5 ${m.role === 'user' ? 'bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-white' : 'bg-white/[0.02] border border-white/5'}`}>
                  {m.modelUsed && (
                    <div className="text-[9px] font-mono text-[#00D4AA] mb-2">
                      Router: {m.modelUsed}
                    </div>
                  )}

                  {/* Attachment Preview in Message list */}
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {m.attachments.map((f: any, idx: number) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-white/10 bg-[#07070B] p-1.5 flex items-center gap-2 max-w-[200px]">
                          {f.previewUrl ? (
                            <img src={f.previewUrl} alt={f.name} className="h-10 w-10 object-cover rounded" />
                          ) : (
                            <Paperclip className="h-5 w-5 text-gray-500" />
                          )}
                          <span className="text-[10px] truncate text-gray-400">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render content mathematically & syntactically */}
                  <MarkdownMathCode content={m.content} />

                  {/* Render dynamic ToolCall components inside chatbot */}
                  {m.toolCall && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                      {/* Diagram Rendering tool */}
                      {m.toolCall.type === 'diagram' && (
                        <div className="rounded-xl bg-white/[0.01] p-3 text-center border border-white/5">
                          <p className="text-xs font-mono text-[#00D4AA] mb-3">{m.toolCall.data.title}</p>
                          <div dangerouslySetInnerHTML={{ __html: m.toolCall.data.svg }} />
                        </div>
                      )}

                      {/* Interactive Quiz card tool */}
                      {m.toolCall.type === 'quiz' && (
                        <div className="rounded-xl bg-white/[0.02] border border-[#6C63FF]/30 p-4">
                          <p className="text-xs font-mono text-[#6C63FF] mb-2 flex items-center gap-1.5">
                            <HelpCircle className="h-4 w-4" /> Inline Quiz Concept Validation
                          </p>
                          <p className="text-sm font-semibold mb-3">{m.toolCall.data.question}</p>
                          
                          {/* If not attempted, show option buttons */}
                          {!store.attemptedQuestions.includes(m.toolCall.data.questionId) ? (
                            <div className="space-y-2">
                              {m.toolCall.data.options.map((opt: string, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => handleQuizAnswer(m.toolCall.data, opt, m.id)}
                                  className="w-full text-left rounded-lg bg-white/5 hover:bg-[#6C63FF]/10 hover:border-[#6C63FF]/40 border border-white/5 px-3.5 py-2.5 text-xs font-medium transition-all"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-xs text-emerald-400 flex items-center gap-2">
                              <CheckCircle2 className="h-4.5 w-4.5" /> Concept completed and scores cached.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Simulated live streaming block */}
            {isStreaming && currentStream && (
              <div className="flex items-start gap-4 justify-start">
                <div className="h-8 w-8 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/30 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4.5 w-4.5 text-[#6C63FF]" />
                </div>
                <div className="max-w-[80%] rounded-2xl p-4.5 bg-white/[0.02] border border-white/5">
                  <div className="text-[9px] font-mono text-[#00D4AA] mb-2 animate-pulse">
                    Router: {streamModel || 'Calculating routing path...'}
                  </div>
                  <MarkdownMathCode content={currentStream} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Upload preview panels */}
          {uploadedFiles.length > 0 && (
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl mb-2 flex gap-3 flex-wrap">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-white/10 bg-[#07070B] p-1.5 flex items-center gap-2 max-w-[200px]">
                  {file.previewUrl ? (
                    <img src={file.previewUrl} alt={file.name} className="h-8 w-8 object-cover rounded" />
                  ) : (
                    <Paperclip className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-[10px] truncate text-gray-400 max-w-[100px]">{file.name}</span>
                  <button 
                    onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form Editor Composers */}
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask a question or upload math expressions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              className="w-full rounded-2xl border border-white/10 bg-[#0B0B10] py-4.5 pl-12 pr-28 text-sm text-white placeholder-gray-500 focus:border-[#6C63FF] focus:outline-none"
            />
            
            {/* File Upload Selector */}
            <div className="absolute left-3.5 flex gap-2">
              <button
                type="button"
                onClick={handleFileUploadClick}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                title="Upload image/diagram"
              >
                <Image className="h-5 w-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
            </div>

            {/* Send / Mic button group */}
            <div className="absolute right-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-xl transition-all ${micActive ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] animate-pulse' : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
                title="Voice input"
              >
                {micActive ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
              </button>
              
              <button
                type="submit"
                disabled={isStreaming || (!input.trim() && uploadedFiles.length === 0)}
                className="p-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5b52eb] text-white disabled:bg-white/5 disabled:text-gray-500 transition-colors"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </DashboardShell>
  );
}
