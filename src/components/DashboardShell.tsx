'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen, Code, GraduationCap, ShieldAlert, Briefcase, 
  Users, Settings, Flame, Award, Coins, RefreshCw, UserCheck, 
  Menu, X, Sparkles 
} from 'lucide-react';
import { getStore, updateStore } from '@/lib/store';
import { xpToLevel, xpForLevel } from '@/lib/gamification';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    setStore(getStore());
    const syncStore = () => setStore(getStore());
    window.addEventListener('eduverse_store_update', syncStore);
    return () => window.removeEventListener('eduverse_store_update', syncStore);
  }, []);

  if (!store) return <div className="min-h-screen bg-[#0A0A0F]" />;

  const currentRole = store.user.role;
  const currentXP = store.gamification.xp_total;
  const level = xpToLevel(currentXP);
  const prevLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpPercentage = Math.min(100, Math.max(0, ((currentXP - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));

  // Navigation items based on role permission
  const navigationItems = [
    { name: 'Student Dashboard', href: '/dashboard', icon: GraduationCap },
    { name: 'AI Tutor', href: '/tutor', icon: Sparkles },
    { name: 'Teacher Panel', href: '/teacher', icon: BookOpen },
    { name: 'Admin Console', href: '/admin', icon: ShieldAlert },
    { name: 'Career Intelligence', href: '/career', icon: Briefcase },
    { name: 'Community Hub', href: '/community', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleRoleChange = (role: 'student' | 'teacher' | 'admin') => {
    updateStore((s) => {
      s.user.role = role;
      s.user.full_name = role === 'student' ? 'Shivam Kumar' : role === 'teacher' ? 'Dr. Helen Vance' : 'System Admin';
      s.user.avatar_url = role === 'student' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' 
        : role === 'teacher' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' 
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80';
    });
    // Trigger global state sync
    window.dispatchEvent(new Event('eduverse_store_update'));
    // Redirect to correct dashboard
    if (role === 'student') router.push('/dashboard');
    else if (role === 'teacher') router.push('/teacher');
    else router.push('/admin');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0F] text-white">
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0B0B10] p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] shadow-[0_0_15px_rgba(108,99,255,0.4)]">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-[#A0A0B8] bg-clip-text text-transparent">EduVerse</span>
              <span className="text-[10px] block font-mono text-[#00D4AA] tracking-widest uppercase">AI Operating System</span>
            </div>
          </Link>
          <button className="lg:hidden p-1 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Role Switcher Quick Widget */}
        <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <img 
              src={store.user.avatar_url} 
              alt={store.user.full_name} 
              className="h-10 w-10 rounded-full border border-[#6C63FF]/30 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{store.user.full_name}</p>
              <div className="flex items-center gap-1.5 text-xs text-[#00D4AA] font-mono">
                <UserCheck className="h-3 w-3" />
                <span className="capitalize">{currentRole}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-1.5 text-xs font-mono">
            {['student', 'teacher', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r as any)}
                className={`rounded-md py-1 border transition-colors capitalize ${currentRole === r ? 'bg-[#6C63FF]/20 border-[#6C63FF] text-white' : 'border-white/5 hover:border-white/20 text-[#A0A0B8]'}`}
              >
                {r.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="mt-8 flex-1 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${active ? 'bg-gradient-to-r from-[#6C63FF]/15 to-transparent border-l-2 border-[#6C63FF] text-white shadow-[inset_4px_0_12px_rgba(108,99,255,0.05)]' : 'text-[#A0A0B8] hover:bg-white/[0.02] hover:text-white'}`}
              >
                <Icon className={`h-4.5 w-4.5 transition-colors ${active ? 'text-[#6C63FF]' : 'text-gray-400 group-hover:text-white'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Settings/Landing Redirect */}
        <div className="mt-auto border-t border-white/5 pt-4 text-xs font-mono text-center text-[#5A5A7A]">
          EduVerse AI v2.0.0
        </div>
      </aside>

      {/* Main content viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#0B0B10] px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-1 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold tracking-tight text-white hidden md:block capitalize">
              {pathname.split('/')[1]?.replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>

          {/* Gamification Header Stats */}
          <div className="flex items-center gap-6">
            {/* Level & XP */}
            <div className="hidden sm:flex flex-col w-36 md:w-48">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0B8] mb-1">
                <span>LVL {level}</span>
                <span>{currentXP} / {nextLevelXp} XP</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] transition-all duration-500 ease-out"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2 rounded-full border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 px-3.5 py-1.5 text-xs font-semibold text-[#FF6B6B] animate-pulse">
              <Flame className="h-4.5 w-4.5 fill-current" />
              <span>{store.gamification.current_streak} DAY STREAK</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#FFB800]">
              <Coins className="h-4.5 w-4.5" />
              <span>{store.gamification.coins}</span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1 text-[#00D4AA] text-xs font-semibold font-mono">
              <Award className="h-4.5 w-4.5" />
              <span>{store.gamification.badges.length} BADGES</span>
            </div>
          </div>
        </header>

        {/* Page Content Layout */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0F] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
