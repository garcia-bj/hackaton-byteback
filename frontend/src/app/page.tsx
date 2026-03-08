'use client';

import { useState } from 'react';
import { Menu, Clock, Building2, CircleDot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
// Components
import RecordEvidence from '@/components/RecordEvidence';
import EvidenceList from '@/components/EvidenceList';
import HelpCentersMap from '@/components/HelpCentersMap';
import UserProfile from '@/components/UserProfile';

type TabType = 'record' | 'list' | 'map' | 'profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('record');

  const navItems = [
    { id: 'record', icon: CircleDot, label: 'Grabar' },
    { id: 'map', icon: Building2, label: 'Centros' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-foreground selection:bg-teal-600/20 font-sans flex flex-col relative">

      {/* Desktop Header */}
      <header className="px-6 md:px-12 py-4 flex items-center justify-between bg-slate-100/80 backdrop-blur-md border-b border-slate-300/50 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl border border-teal-500/30 overflow-hidden bg-white shadow-sm">
            <Image src="/logo.jpeg" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="font-bold text-xl md:text-2xl text-teal-700 hidden sm:block tracking-wide">
            ProtegeT
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={cn(
                "font-semibold text-sm pb-1 border-b-2 transition-colors",
                activeTab === item.id ? "border-cyan-400 text-teal-700 shadow-[0_4px_10px_-4px_rgba(111,255,233,0.5)]" : "border-transparent text-slate-500 hover:text-teal-600"
              )}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </button>
          ))}
        </nav>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-center w-full relative px-4 py-4">
          <h1 className="font-bold text-xl text-teal-700 tracking-wide font-sans">
            {navItems.find(n => n.id === activeTab)?.label}
          </h1>
          <button className="absolute right-4 text-slate-500 hover:text-teal-700 p-1 transition-colors">
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col pb-24 md:pb-12 pt-6 overflow-y-auto overflow-x-hidden md:items-center">
        <div className="w-full max-w-5xl md:px-6">
          {activeTab === 'record' && <RecordEvidence />}
          {activeTab === 'map' && (
            <div className="p-6 md:p-0">
              <HelpCentersMap />
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="p-6 md:p-0">
              <UserProfile />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Floating Pill Design) */}
      <nav className="md:hidden fixed bottom-6 w-full px-6 z-50 pointer-events-none">
        <div className="bg-white backdrop-blur-xl bg-opacity-95 rounded-3xl p-2.5 flex justify-around items-center max-w-sm mx-auto shadow-[0_20px_40px_rgba(11,19,43,0.8)] border border-slate-300/50 pointer-events-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all duration-300 group"
              >
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-teal-600 shadow-[0_0_10px_rgba(111,255,233,0.8)]" />
                )}

                <div className={cn(
                  "p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center",
                  isActive ? 'bg-teal-600/20 text-teal-700 scale-110' : 'text-slate-500 group-hover:text-teal-600'
                )}>
                  <item.icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[10px] tracking-wide transition-all duration-300",
                  isActive ? 'font-bold text-teal-700' : 'font-medium text-slate-500'
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
