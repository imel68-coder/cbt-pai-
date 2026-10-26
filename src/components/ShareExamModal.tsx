/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Smartphone, 
  Key, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { ExamTokenState } from '../types/cbt';

interface ShareExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenState: ExamTokenState;
}

export const ShareExamModal: React.FC<ShareExamModalProps> = ({
  isOpen,
  onClose,
  tokenState
}) => {
  const [copied, setCopied] = useState(false);
  const examUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://shiny-ganache-a899e7.netlify.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(examUrl)}&margin=10`;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(examUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `*ASESMEN CBT PAI & BP SMP*\n\nKepada seluruh siswa, silakan masuk ke link ujian berikut melalui HP/Laptop masing-masing:\n🔗 Link: ${examUrl}\n\n🔑 *Token Ujian:* ${tokenState.token}\n🔐 Password: 123456\n\nMasukkan Nomor Peserta masing-masing dan kerjakan dengan jujur. Selamat mengerjakan!`;

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Bagikan Ujian ke Siswa</h3>
              <p className="text-xs text-blue-200">Siswa buka link atau scan QR code langsung di HP</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs">
          {/* Cloud Synchronized Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3 text-emerald-900">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping mt-1 shrink-0" />
            <div>
              <span className="font-bold text-xs block text-emerald-800">
                🟢 Database Cloud Aktif (Sinkronisasi Otomatis)
              </span>
              <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                Setiap siswa yang mengerjakan dan menekan <strong>"Selesai Ujian"</strong> di HP mereka, nilainya akan <strong>langsung otomatis masuk</strong> ke menu Rekap Nilai di laptop guru.
              </p>
            </div>
          </div>

          {/* QR Code & Token Box */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <div className="bg-white p-2.5 rounded-xl border-2 border-slate-300 shadow-xs shrink-0 flex flex-col items-center">
              <img
                src={qrCodeUrl}
                alt="QR Code Link Ujian Siswa"
                className="w-36 h-36 object-contain rounded-md"
                loading="lazy"
              />
              <span className="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                <QrCode className="w-3 h-3 text-blue-600" />
                Scan via Kamera HP
              </span>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Token Ujian Aktif:
                </label>
                <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-2 text-amber-900">
                  <Key className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-mono font-black text-lg tracking-wider text-amber-950">
                    {tokenState.token}
                  </span>
                  <span className="ml-auto text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                    Wajib Diisi Siswa
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Password Login Default Siswa:
                </label>
                <div className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-700 text-xs">
                  123456
                </div>
              </div>
            </div>
          </div>

          {/* Link Box */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Tautan Ujian untuk Dibagikan ke Siswa:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={examUrl}
                className="flex-1 px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tombol Bagikan WhatsApp */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Bagikan Tautan & Token ke WhatsApp Grup Siswa</span>
            </button>
          </div>

          {/* Langkah untuk Siswa */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Panduan 3 Langkah untuk Siswa di HP:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>Siswa membuka tautan di Google Chrome / Safari HP.</li>
              <li>Masukkan <strong>Nomor Peserta</strong> (terdaftar di Manajemen Siswa), password <code>123456</code>, dan Token <code>{tokenState.token}</code>.</li>
              <li>Klik <strong>Mulai Ujian</strong>, kerjakan soal, lalu klik <strong>Selesai Ujian</strong>. Nilai otomatis masuk ke laptop guru!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
