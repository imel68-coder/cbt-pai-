/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Printer, 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BarChart3,
  Award,
  MessageCircle
} from 'lucide-react';
import { ExamResult, Question } from '../types/cbt';

interface ExamResultViewProps {
  result: ExamResult;
  questions: Question[];
  onBackToDashboard: () => void;
  onRetakeExam: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  result,
  questions,
  onBackToDashboard,
  onRetakeExam
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'pembahasan'>('ringkasan');
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(1);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} menit ${s} detik`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareToWhatsApp = () => {
    const text = `*BUKTI HASIL UJIAN CBT PAI & BP*\n\n` +
      `👤 *Nama:* ${result.student.nama}\n` +
      `🔢 *No. Peserta:* ${result.student.noPeserta}\n` +
      `🏫 *Kelas:* ${result.student.kelas}\n` +
      `📝 *Mata Pelajaran:* ${result.examTitle}\n\n` +
      `📊 *Nilai Akhir:* ${Math.round(result.percentage)} / 100\n` +
      `🎯 *Status:* ${result.isPassed ? 'LULUS (MEMENUHI KKM)' : 'BELUM MEMENUHI KKM'}\n` +
      `✅ *Benar:* ${result.correctCount} | ❌ *Salah:* ${result.wrongCount} | ⚪ *Kosong:* ${result.unansweredCount}\n` +
      `⏱️ *Durasi Pengerjaan:* ${formatDuration(result.durationSecondsUsed)}\n\n` +
      `_Telah tersimpan secara otomatis di database rekap guru._`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner (No Print) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md no-print">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold">Hasil Ujian CBT PAI & BP</h1>
              <p className="text-xs text-blue-200">Asesmen & Rekapitulasi Nilai Pendidikan Agama Islam</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleShareToWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
              title="Kirim Bukti Hasil ke WhatsApp Guru"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>Kirim Hasil ke WA Guru</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak PDF</span>
            </button>
            <button
              type="button"
              onClick={onRetakeExam}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Ulang</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        {/* Banner Konfirmasi Sinkronisasi Cloud (No Print) */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 text-emerald-900 shadow-xs no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              ✓
            </div>
            <div>
              <div className="font-extrabold text-xs text-emerald-950 flex items-center gap-2">
                <span>Nilai Tersimpan di Database Cloud Guru</span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  Tersinkronisasi Otomatis
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Pengerjaan ujian oleh <strong>{result.student.nama}</strong> ({result.student.noPeserta}) telah terkirim dan langsung masuk ke tabel rekap nilai pengawas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleShareToWhatsApp}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Kirim Bukti WA</span>
          </button>
        </div>

        {/* Navigation Tabs (No Print) */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-300 pb-3 no-print">
          <button
            type="button"
            onClick={() => setActiveTab('ringkasan')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'ringkasan'
                ? 'bg-blue-900 text-white shadow'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Sertifikat & Ringkasan Nilai</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pembahasan')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              activeTab === 'pembahasan'
                ? 'bg-blue-900 text-white shadow'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Kunci & Pembahasan Soal ({questions.length} Butir)</span>
          </button>
        </div>

        {/* TAB 1: RINGKASAN & SERTIFIKAT RESMI */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            {/* KARTU HASIL UJIAN RESMI (PRINTABLE FORMAT) */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden print:border print:shadow-none">
              
              {/* Header Kartu */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-6 sm:px-8 py-6 text-white border-b-4 border-amber-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-amber-400 text-blue-950 font-black text-2xl flex items-center justify-center border-2 border-white shadow">
                      CBT
                    </div>
                    <div>
                      <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
                        KARTU HASIL ASESMEN DIGITAL
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black">{result.examTitle}</h2>
                      <p className="text-xs text-slate-300">Asesmen Pendidikan Agama Islam dan Budi Pekerti 2026</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl text-center">
                    <div className="text-[10px] text-blue-200 uppercase font-semibold">Status Kelulusan</div>
                    <div className={`text-base font-extrabold ${result.isPassed ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {result.isPassed ? '✓ MEMENUHI SYARAT (LULUS)' : 'BELUM MEMENUHI'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Identitas Siswa & Informasi Ujian */}
              <div className="p-6 sm:p-8 bg-slate-50/60 border-b border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Nama Peserta:</span>
                    <strong className="text-slate-900 text-sm font-bold block">{result.student.nama}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Nomor Peserta:</span>
                    <span className="font-mono font-bold text-blue-700 text-sm">{result.student.noPeserta}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">NISN / Kelas:</span>
                    <span className="font-semibold text-slate-800">{result.student.nisn} ({result.student.kelas})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Asal Sekolah:</span>
                    <span className="font-semibold text-slate-800">{result.student.sekolah}</span>
                  </div>
                </div>
              </div>

              {/* Skor Utama & Kartu Statistik */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  
                  {/* Skor Standar */}
                  <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Skor Standar CBT</span>
                        <Trophy className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight">
                        {result.scaleScore}
                      </div>
                      <div className="text-xs text-blue-200 mt-1 font-medium">
                        Rentang Standar Nilai: 200 - 900
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/15 text-xs text-slate-200">
                      Persentase Nilai: <strong className="text-white text-sm">{result.percentage}%</strong>
                    </div>
                  </div>

                  {/* Rincian Jawaban */}
                  <div className="md:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-blue-700" />
                        Rincian Akurasi Pengerjaan:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="bg-emerald-100/70 border border-emerald-300 rounded-xl p-3">
                          <div className="text-xs text-emerald-800 font-bold">Benar</div>
                          <div className="text-2xl font-black text-emerald-700 mt-0.5">{result.correctCount}</div>
                          <div className="text-[10px] text-emerald-600 font-medium">Soal</div>
                        </div>
                        <div className="bg-rose-100/70 border border-rose-300 rounded-xl p-3">
                          <div className="text-xs text-rose-800 font-bold">Salah</div>
                          <div className="text-2xl font-black text-rose-700 mt-0.5">{result.wrongCount}</div>
                          <div className="text-[10px] text-rose-600 font-medium">Soal</div>
                        </div>
                        <div className="bg-slate-200/70 border border-slate-300 rounded-xl p-3">
                          <div className="text-xs text-slate-700 font-bold">Kosong</div>
                          <div className="text-2xl font-black text-slate-800 mt-0.5">{result.unansweredCount}</div>
                          <div className="text-[10px] text-slate-500 font-medium">Soal</div>
                        </div>
                        <div className="bg-blue-100/70 border border-blue-300 rounded-xl p-3">
                          <div className="text-xs text-blue-800 font-bold">Waktu Terpakai</div>
                          <div className="text-lg font-black text-blue-800 mt-1">
                            {Math.floor(result.durationSecondsUsed / 60)}m {result.durationSecondsUsed % 60}s
                          </div>
                          <div className="text-[10px] text-blue-600 font-medium">5m / butir soal</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Nilai per Subtes */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                    Kompetensi Nilai Berdasarkan Subtes:
                  </h4>
                  <div className="space-y-3">
                    {result.subtestScores.map((sub, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-800">{sub.subtest}</span>
                          <span className="text-blue-700">
                            {sub.correct} dari {sub.total} benar ({sub.score}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all rounded-full ${
                              sub.score >= 70 ? 'bg-emerald-500' : sub.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${sub.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tanda Tangan Digital Resmi (Bagus untuk Cetak) */}
                <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <p className="font-semibold">Catatan Pengawas:</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Siswa menyelesaikan ujian secara mandiri melalui sistem CBT terotentikasi.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Sistem CBT Pusmendik / TKA</p>
                    <p className="font-mono text-[11px] text-blue-700 mt-1">
                      VERIFIKASI ID: #{result.examId}-{result.student.noPeserta}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KUNCI JAWABAN & PEMBAHASAN LENGKAP */}
        {activeTab === 'pembahasan' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 flex items-center justify-between">
              <div>
                <strong className="block font-bold">Kajian Pembahasan Soal CBT TKA</strong>
                <span>Pelajari langkah penyelesaian dan kunci jawaban resmi untuk meningkatkan performa ujian berikutnya.</span>
              </div>
              <span className="font-bold text-blue-700 shrink-0 ml-4">
                {result.correctCount} / {result.totalQuestions} Benar
              </span>
            </div>

            {questions.map((q) => {
              const userAns = result.answers[q.id];
              let isCorrect = false;

              if (userAns) {
                if (q.type === 'pg' && userAns.selectedOption === q.correctAnswer) {
                  isCorrect = true;
                } else if (q.type === 'pgk' && Array.isArray(q.correctAnswer) && userAns.selectedOptions) {
                  const sortedU = [...userAns.selectedOptions].sort();
                  const sortedC = [...q.correctAnswer].sort();
                  isCorrect = sortedU.length === sortedC.length && sortedU.every((v, i) => v === sortedC[i]);
                } else if (q.type === 'bs' && q.statements && userAns.statementAnswers) {
                  isCorrect = q.statements.every((s) => userAns.statementAnswers?.[s.id] === s.correctAnswer);
                } else if (q.type === 'menjodohkan' && q.matchingPremises && userAns.matchingAnswers) {
                  isCorrect = q.matchingPremises.every((p) => userAns.matchingAnswers?.[p.id] === p.correctMatch);
                }
              }

              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden transition ${
                    isCorrect ? 'border-emerald-300' : 'border-rose-300'
                  }`}
                >
                  {/* Question Bar Header */}
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                          isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      >
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            Soal No. {q.number}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {q.subtest}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {q.questionText}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? 'Benar (+4 Poin)' : 'Salah (0 Poin)'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="p-6 bg-slate-50/80 border-t border-slate-200 text-xs sm:text-sm space-y-4">
                      {q.stimulus && (
                        <div className="p-4 bg-white rounded-lg border border-slate-200 text-slate-700 italic">
                          <strong className="block not-italic text-xs text-blue-900 mb-1 font-bold">
                            Wacana / Stimulus:
                          </strong>
                          {q.stimulus}
                        </div>
                      )}

                      <div>
                        <span className="font-bold text-slate-800 block mb-1">Pertanyaan:</span>
                        <p className="text-slate-900 font-medium">{q.questionText}</p>
                      </div>

                      {/* Display Options & User vs Correct */}
                      {q.type === 'pg' && q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const isUserChoice = userAns?.selectedOption === opt.key;
                            const isKey = q.correctAnswer === opt.key;

                            let optBorder = 'border-slate-200 bg-white';
                            if (isKey) {
                              optBorder = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                            } else if (isUserChoice && !isKey) {
                              optBorder = 'border-rose-400 bg-rose-50 text-rose-950 font-semibold';
                            }

                            return (
                              <div
                                key={opt.key}
                                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${optBorder}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[11px]">
                                    {opt.key}
                                  </span>
                                  <span>{opt.text}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px]">
                                  {isKey && (
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Kunci Jawaban
                                    </span>
                                  )}
                                  {isUserChoice && !isKey && (
                                    <span className="text-rose-700 font-bold flex items-center gap-1">
                                      <XCircle className="w-3.5 h-3.5" /> Jawaban Anda
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Display PGK (Pilihan Ganda Kompleks) Review */}
                      {q.type === 'pgk' && q.options && (
                        <div className="space-y-2">
                          <div className="text-[11px] text-indigo-800 font-semibold mb-1">
                            * Bentuk Soal: Pilihan Ganda Kompleks ({Array.isArray(q.correctAnswer) ? q.correctAnswer.length : 'Beberapa'} Jawaban Benar)
                          </div>
                          {q.options.map((opt) => {
                            const isUserChecked = userAns?.selectedOptions?.includes(opt.key);
                            const isCorrectChoice = Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt.key);

                            let borderClass = 'border-slate-200 bg-white';
                            if (isCorrectChoice) {
                              borderClass = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
                            } else if (isUserChecked && !isCorrectChoice) {
                              borderClass = 'border-rose-400 bg-rose-50 text-rose-950 font-semibold';
                            }

                            return (
                              <div
                                key={opt.key}
                                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${borderClass}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="font-bold">{opt.key}.</span>
                                  <span>{opt.text}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] shrink-0">
                                  {isCorrectChoice && (
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Kunci Benar
                                    </span>
                                  )}
                                  {isUserChecked ? (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                                      Dipilih Siswa
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">Tidak Dipilih</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Display Benar/Salah (B/S) Review */}
                      {q.type === 'bs' && q.statements && (
                        <div className="space-y-2">
                          <div className="text-[11px] text-blue-800 font-semibold mb-1">
                            * Bentuk Soal: Benar atau Salah
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-slate-300 text-xs">
                              <thead className="bg-slate-100 font-bold text-slate-700">
                                <tr>
                                  <th className="p-2.5 border border-slate-300 text-left">Pernyataan</th>
                                  <th className="p-2.5 border border-slate-300 text-center w-28">Kunci Jawaban</th>
                                  <th className="p-2.5 border border-slate-300 text-center w-28">Jawaban Siswa</th>
                                </tr>
                              </thead>
                              <tbody>
                                {q.statements.map((stmt) => {
                                  const userChoice = userAns?.statementAnswers?.[stmt.id];
                                  const isStmtCorrect = userChoice === stmt.correctAnswer;
                                  return (
                                    <tr key={stmt.id} className="border-b border-slate-200">
                                      <td className="p-2.5 border border-slate-300 text-slate-800">{stmt.text}</td>
                                      <td className="p-2.5 border border-slate-300 text-center font-bold text-emerald-700 bg-emerald-50/50">
                                        {stmt.correctAnswer === 'B' ? 'BENAR' : 'SALAH'}
                                      </td>
                                      <td className={`p-2.5 border border-slate-300 text-center font-bold ${
                                        isStmtCorrect ? 'text-emerald-700' : 'text-rose-700 bg-rose-50/50'
                                      }`}>
                                        {userChoice ? (userChoice === 'B' ? 'BENAR' : 'SALAH') : '-'}
                                        {isStmtCorrect ? ' ✓' : ' ✗'}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Display Menjodohkan (Matching) Review */}
                      {q.type === 'menjodohkan' && q.matchingPremises && (
                        <div className="space-y-2">
                          <div className="text-[11px] text-blue-800 font-semibold mb-1">
                            * Bentuk Soal: Menjodohkan Pasangan
                          </div>
                          <div className="space-y-2">
                            {q.matchingPremises.map((p, idx) => {
                              const userMatched = userAns?.matchingAnswers?.[p.id];
                              const isPairCorrect = userMatched === p.correctMatch;
                              return (
                                <div
                                  key={p.id}
                                  className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                                    isPairCorrect ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 font-bold text-slate-900">
                                    <span className="w-5 h-5 rounded bg-blue-900 text-white flex items-center justify-center text-[10px]">
                                      {idx + 1}
                                    </span>
                                    <span>{p.premise}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-emerald-800">
                                      Kunci: <span className="underline">{p.correctMatch}</span>
                                    </div>
                                    <div className={`text-[11px] font-medium ${isPairCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                                      Dipilih: {userMatched || '(Kosong)'} {isPairCorrect ? '✓' : '✗'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Penjelasan Ilmiah */}
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                        <strong className="text-xs font-bold text-blue-950 block mb-1">
                          Pembahasan Solusi:
                        </strong>
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
