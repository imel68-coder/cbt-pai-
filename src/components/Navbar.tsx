/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, Shield, Globe, Award, Sparkles, BarChart3, Share2 } from 'lucide-react';
import { ExamTokenState } from '../types/cbt';

interface NavbarProps {
  tokenState: ExamTokenState;
  onOpenSupervisor: () => void;
  onOpenGrades?: () => void;
  onOpenShare?: () => void;
  currentView: 'dashboard' | 'exam' | 'result';
}

export const Navbar: React.FC<NavbarProps> = ({
  tokenState,
  onOpenSupervisor,
  onOpenGrades,
  onOpenShare,
  currentView
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' WIB'
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // During the exam, we let the exam view render its own full-screen focused header
  if (currentView === 'exam') return null;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-white text-base shadow-md border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  CBT PAI & BP PORTAL
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  PAI & BP SMP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Sistem Asesmen Terstandar Pendidikan Agama Islam dan Budi Pekerti
              </p>
            </div>
          </div>

          {/* Real-time Server Clock (WIB) & Server Status */}
          <div className="flex items-center gap-4">
            
            <div className="hidden md:flex flex-col text-right">
              <div className="text-xs font-mono font-bold text-amber-300 flex items-center justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentTime}</span>
              </div>
              <span className="text-[10px] text-slate-400">{currentDate}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Server Online (Sinkron)</span>
            </div>

            {/* Bagikan Ujian (QR & Link) Trigger */}
            {onOpenShare && (
              <button
                type="button"
                onClick={onOpenShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition text-xs font-bold shadow-xs cursor-pointer"
                title="Bagikan Tautan Ujian & QR Code ke Siswa"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Bagikan ke Siswa</span>
              </button>
            )}

            {/* Rekap Nilai Siswa Trigger */}
            {onOpenGrades && (
              <button
                type="button"
                onClick={onOpenGrades}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 transition text-xs font-bold cursor-pointer"
                title="Lihat & Download Nilai Siswa"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Nilai Siswa</span>
              </button>
            )}

            {/* Supervisor trigger */}
            <button
              type="button"
              onClick={onOpenSupervisor}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Panel Guru & Pengawas CBT"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
