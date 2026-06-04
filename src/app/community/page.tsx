'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { getStore } from '@/lib/store';
import {
  Users, MessageSquare, Award, Monitor, Palette,
  Trash2, RefreshCw, Star, ArrowRight, UserPlus, Heart, Send, Check
} from 'lucide-react';

export default function CommunityHub() {
  const [store, setStore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'forums' | 'whiteboard' | 'mentors' | 'peer_review'>('whiteboard');
  
  // Forums States
  const [forumInput, setForumInput] = useState('');
  const [posts, setPosts] = useState([
    { id: 'p-1', author: 'Alex Math', role: 'student', title: 'Why is linear transformation preservation key?', body: 'In matrix math, I get T(u+v) = T(u)+T(v) mechanically. But what is the geometric intuition?', upvotes: 12, comments: 3 },
    { id: 'p-2', author: 'Dr. Helen Vance', role: 'teacher', title: 'Curriculum standards updates for CS-23', body: 'Added new modules on pgvector semantic query indexing inside advanced courses.', upvotes: 24, comments: 5 }
  ]);

  // Whiteboard Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#6C63FF');
  const [brushSize, setBrushSize] = useState(3);
  const [activeMembers, setActiveMembers] = useState(['Shivam K.', 'Sarah S.', 'Alex M.']);

  useEffect(() => {
    setStore(getStore());
  }, []);

  // Initialize Canvas Drawing context
  useEffect(() => {
    if (activeTab === 'whiteboard') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = brushColor;
          ctx.lineWidth = brushSize;
          
          // Draw standard initial diagram grid background/mock
          ctx.fillStyle = '#0B0B10';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw a mock coordinate space axis to welcome them
          ctx.strokeStyle = 'rgba(255,255,255,0.06)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, 0);
          ctx.lineTo(canvas.width / 2, canvas.height);
          ctx.moveTo(0, canvas.height / 2);
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        }
      }
    }
  }, [activeTab]);

  // Handle color change on stroke
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
      }
    }
  }, [brushColor, brushSize]);

  if (!store) return null;

  // Drawing mouse handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0B0B10';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    }
  };

  const handlePostForum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumInput.trim()) return;

    const newPost = {
      id: `p-${Date.now()}`,
      author: 'Shivam Kumar (You)',
      role: 'student',
      title: forumInput,
      body: 'Reviewing Dijkstra and IRT scoring systems in the study rooms.',
      upvotes: 1,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setForumInput('');
  };

  // Peer review cards mock list
  const peerReviews = [
    { id: 'pr-1', studentName: 'Alex Math', subject: 'Linear Algebra Transformations Proof', status: 'Pending Review', deadline: 'Due in 2 days' },
    { id: 'pr-2', studentName: 'Sarah Spark', subject: 'Fibonacci Tabulation optimal solver', status: 'Completed', deadline: 'Finished' }
  ];

  // Mentor Matching recommendations
  const mentors = [
    { name: 'Dr. Helen Vance', subjects: ['Mathematics', 'Computer Science'], score: '98% Match', location: 'EST Timezone', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
    { name: 'Alice Dev', subjects: ['Algorithms', 'Web Engineering'], score: '85% Match', location: 'PST Timezone', rating: 4.7, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' }
  ];

  return (
    <DashboardShell>
      {/* Community Tabs */}
      <div className="flex border-b border-white/5 pb-1 mb-8 overflow-x-auto gap-4">
        {[
          { id: 'whiteboard', name: 'Collaborative Whiteboard', icon: Monitor },
          { id: 'forums', name: 'Discussion Boards', icon: MessageSquare },
          { id: 'mentors', name: 'Mentor Matching (ML)', icon: Users },
          { id: 'peer_review', name: 'Peer Review Assignments', icon: Award }
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

      {/* Tabs panels */}
      <div className="space-y-6">

        {/* 1. Whiteboard Canvas Room */}
        {activeTab === 'whiteboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Whiteboard view screen */}
            <div className="lg:col-span-9 flex flex-col space-y-4">
              <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {/* Colors */}
                  <div className="flex items-center gap-1.5">
                    {['#6C63FF', '#00D4AA', '#FF6B6B', '#FFFFFF'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setBrushColor(color)}
                        className={`h-6 w-6 rounded-full border transition-all ${brushColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  {/* Brush width */}
                  <div className="flex items-center gap-2 text-xs text-[#A0A0B8]">
                    <span>Size:</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={brushSize} 
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20 accent-[#6C63FF]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearCanvas}
                    className="text-xs font-semibold border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 hover:bg-[#FF6B6B]/15 text-[#FF6B6B] rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear board
                  </button>
                </div>
              </div>

              {/* HTML5 Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[450px]">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={450}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full cursor-crosshair bg-[#0B0B10]"
                />
              </div>
            </div>

            {/* Right sidebar: active members */}
            <div className="lg:col-span-3 space-y-4">
              <div className="glass-card p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xs font-bold text-[#00D4AA] uppercase tracking-wider mb-4">Study Group Members</h3>
                  <div className="space-y-4">
                    {activeMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs text-white">
                        <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[9px]">
                          {member.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold">{member}</span>
                        <span className="h-2 w-2 rounded-full bg-[#00D4AA] ml-auto animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 border-t border-white/5 pt-4">
                  <p className="text-[10px] text-gray-500 font-mono">Live synchronization active. Liveblocks simulation running.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Forums Discussions List */}
        {activeTab === 'forums' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="glass-card p-6 flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#00D4AA] font-mono capitalize">Author: {post.author} ({post.role})</span>
                      <span className="text-xs text-gray-500 font-mono">{post.upvotes} upvotes</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-2 hover:text-[#6C63FF] cursor-pointer transition-colors">{post.title}</h3>
                    <p className="text-xs text-[#A0A0B8] mt-2.5 leading-relaxed">{post.body}</p>
                  </div>
                  
                  <div className="flex gap-4 border-t border-white/5 pt-3.5 text-xs text-[#5A5A7A]">
                    <button className="flex items-center gap-1 hover:text-white transition-colors"><Heart className="h-4 w-4" /> Upvote</button>
                    <button className="flex items-center gap-1 hover:text-white transition-colors"><MessageSquare className="h-4 w-4" /> Reply ({post.comments})</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <form onSubmit={handlePostForum} className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">Create Forum Thread</h3>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask a question..."
                  value={forumInput}
                  onChange={(e) => setForumInput(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#07070B] px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#6C63FF] focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#6C63FF] hover:bg-[#5b52eb] py-2.5 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1"
                >
                  Publish Thread <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. Mentor Matching */}
        {activeTab === 'mentors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor, idx) => (
              <div key={idx} className="glass-card p-6 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <img src={mentor.avatar} alt={mentor.name} className="h-12 w-12 rounded-full border border-[#00D4AA]/30 object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{mentor.name}</h4>
                    <span className="text-[10px] text-[#00D4AA] font-mono">{mentor.score} (ML matched)</span>
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {mentor.subjects.map((sub, sIdx) => (
                        <span key={sIdx} className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] text-gray-400 font-mono">{sub}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#A0A0B8]">
                  <span>{mentor.location}</span>
                  <button className="rounded-lg bg-[#6C63FF] hover:bg-[#5b52eb] text-white px-4 py-1.5 font-semibold transition-colors flex items-center gap-1">
                    Connect <UserPlus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Peer Review checklists */}
        {activeTab === 'peer_review' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {peerReviews.map((pr) => (
              <div key={pr.id} className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">{pr.subject}</h4>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${pr.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {pr.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A0B8] mt-3">Submitted by: <b>{pr.studentName}</b></p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-mono">{pr.deadline}</span>
                  {pr.status !== 'Completed' && (
                    <button className="rounded-lg bg-[#00D4AA] hover:bg-[#00b994] text-black px-4 py-1.5 font-semibold transition-colors flex items-center gap-1">
                      Start Review <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
