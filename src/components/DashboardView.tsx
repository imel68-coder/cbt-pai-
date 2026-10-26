/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  Key, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Student, ExamTokenState, ClassRombel, Question, isQuestionAssignedToClass } from '../types/cbt';
import { MOCK_STUDENTS, MOCK_EXAM_INFO } from '../data/mockQuestions';

interface DashboardViewProps {
  onStartExam: (student: Student, enteredToken: string) => void;
  tokenState: ExamTokenState;
  onOpenSupervisorModal: () => void;
  onOpenGradesModal?: () => void;
  onOpenShare?: () => void;
  lastResult: any;
  onViewLastResult: () => void;
  students: Student[];
  prefilledStudent?: Student | null;
  classes: ClassRombel[];
  questions?: Question[];
  totalExamResults?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartExam,
  tokenState,
  onOpenSupervisorModal,
  onOpenGradesModal,
  onOpenShare,
  lastResult,
  onViewLastResult,
  students,
  prefilledStudent,
  classes,
  questions,
  totalExamResults
}) => {
  const [noPeserta, setNoPeserta] = useState(prefilledStudent?.noPeserta || students[0]?.noPeserta || '24-01-09-0012');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [tokenInput, setTokenInput] = useState(tokenState.token);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>(prefilledStudent || students[0] || MOCK_STUDENTS[0]);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Sync token input if supervisor changed it
  useEffect(() => {
    setTokenInput(tokenState.token);
  }, [tokenState.token]);

  // Sync prefilled student if selected from supervisor modal
  useEffect(() => {
    if (prefilledStudent) {
      setSelectedStudent(prefilledStudent);
      setNoPeserta(prefilledStudent.noPeserta);
      setPassword('123456');
    }
  }, [prefilledStudent]);

  // Dynamic question count for selected student's class
  const activeStudentQuestionCount = React.useMemo(() => {
    if (!questions || questions.length === 0) return 15;
    const forStudent = questions.filter((q) => isQuestionAssignedToClass(q, selectedStudent.kelas));
    return forStudent.length > 0 ? forStudent.length : questions.length;
  }, [questions, selectedStudent]);

  const handleSelectDemoAccount = (student: Student) => {
    setSelectedStudent(student);
    setNoPeserta(student.noPeserta);
    setPassword('123456');
    setErrorMsg('');

    // Check if class has dedicated token
    const stdClass = classes.find(
      (c) =>
        c.name.toLowerCase() === student.kelas.toLowerCase() ||
        student.kelas.toLowerCase().includes(c.code.toLowerCase())
    );
    if (stdClass?.token) {
      setTokenInput(stdClass.token);
    } else {
      setTokenInput(tokenState.token);
    }
  };

  const handleAttemptLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNo = noPeserta.trim().toLowerCase();
    const foundStudent = students.find(
      (s) => s.noPeserta.trim().toLowerCase() === cleanNo || s.nisn.trim().toLowerCase() === cleanNo
    );

    if (!foundStudent) {
      setErrorMsg('Nomor peserta atau NISN tidak ditemukan dalam daftar peserta ujian.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Kata sandi / password wajib diisi.');
      return;
    }

    // 1. Verifikasi Status Aktivasi Ujian Kelas Siswa (6 Rombel)
    const studentClass = classes.find(
      (c) =>
        c.name.toLowerCase() === foundStudent.kelas.toLowerCase() ||
        foundStudent.kelas.toLowerCase().includes(c.code.toLowerCase()) ||
        c.name.toLowerCase().includes(foundStudent.kelas.toLowerCase())
    );

    if (studentClass && !studentClass.isActive) {
      setErrorMsg(
        `SESI KELAS BELUM DIBUKA: Ujian untuk rombel ${foundStudent.kelas} saat ini sedang NONAKTIF / BELUM DIBUKA oleh Guru Pengawas. Silakan tunggu aba-aba dari pengawas.`
      );
      return;
    }

    // 2. Verifikasi Token Ujian
    const enteredTokenClean = tokenInput.trim().toUpperCase();
    const isGlobalTokenValid = enteredTokenClean === tokenState.token.toUpperCase();
    const isClassTokenValid = studentClass?.token && enteredTokenClean === studentClass.token.toUpperCase();

    if (!isGlobalTokenValid && !isClassTokenValid) {
      setErrorMsg(
        `Token Ujian tidak sesuai. Masukkan Token Aktif dari Pengawas Ujian: "${tokenState.token}"`
      );
      return;
    }

    setSelectedStudent(foundStudent);
    setShowConfirmModal(true);
  };

  const handleConfirmStart = () => {
    if (!agreedTerms) {
      alert('Silakan centang pernyataan kesiapan dan tata tertib ujian sebelum memulai.');
      return;
    }
    setShowConfirmModal(false);
    onStartExam(selectedStudent, tokenInput.trim().toUpperCase());
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="max-w-xl w-full mx-auto my-auto space-y-6">
        
        {/* Card Login Siswa CBT */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-300/40 border border-slate-200/90 overflow-hidden">
          
          {/* Header Portal Login */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 sm:px-8 py-7 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center shadow-lg mb-3">
                <GraduationCap className="w-8 h-8 text-amber-300" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>PORTAL ASESMEN SUMATIF RESMI</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                LOGIN PESERTA UJIAN CBT
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Pendidikan Agama Islam & Budi Pekerti (PAI & BP)
              </p>
            </div>
          </div>

          {/* Form Login Peserta */}
          <div className="p-6 sm:p-8">
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="leading-relaxed font-medium">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleAttemptLogin} className="space-y-4">
              
              {/* Field 1: Nomor Peserta */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nomor Peserta Ujian / NISN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={noPeserta}
                    onChange={(e) => setNoPeserta(e.target.value)}
                    placeholder="Contoh: 24-01-09-0012 atau NISN"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ketik nomor peserta yang tertera pada Kartu Peserta Ujian Anda.
                </p>
              </div>

              {/* Field 2: Kata Sandi (Password) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password akun Anda"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Default password peserta: <span className="font-mono font-bold text-slate-700">123456</span>
                </p>
              </div>

              {/* Field 3: Token Ujian */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Token Ujian
                  </label>
                  <button
                    type="button"
                    onClick={() => setTokenInput(tokenState.token)}
                    className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Key className="w-3 h-3 text-blue-500" />
                    <span>Isi Token Sesi: {tokenState.token}</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-600">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: PAI7A"
                    maxLength={10}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-amber-50/70 border border-amber-300 rounded-xl text-base font-mono font-bold tracking-widest text-amber-950 uppercase placeholder:text-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Minta 6 karakter token kepada guru pengawas yang sedang bertugas di ruang kelas.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>MASUK KE UJIAN</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>

            {/* Riwayat Hasil Terakhir Jika Ada */}
            {lastResult && (
              <div className="mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-xs truncate">
                    <span className="font-bold text-emerald-900 block truncate">Hasil Ujian Sebelumnya Tersimpan</span>
                    <span className="text-emerald-700 font-medium">Skor: {lastResult.scaleScore} / 900 ({lastResult.percentage}%)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onViewLastResult}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shrink-0 cursor-pointer"
                >
                  Lihat Hasil
                </button>
              </div>
            )}

            {/* Bantuan Pemilihan Akun Demo (Collapsible untuk kemudahan pengujian) */}
            <div className="mt-5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-blue-700 py-1 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Bantuan: Klik untuk Pilih Akun Siswa ({students.length} Siswa Terdaftar)</span>
                </span>
                {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDemoAccounts && (
                <div className="mt-3 space-y-1.5 max-h-52 overflow-y-auto pr-1 animate-in fade-in duration-150">
                  <p className="text-[11px] text-slate-500 mb-2">
                    Klik nama salah satu siswa di bawah untuk mengisi form nomor peserta dan token secara instan:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {students.map((std) => (
                      <button
                        key={std.id}
                        type="button"
                        onClick={() => handleSelectDemoAccount(std)}
                        className={`text-left p-2 rounded-xl border text-xs transition flex items-center gap-2 cursor-pointer ${
                          noPeserta === std.noPeserta
                            ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold ring-1 ring-blue-400'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <img
                          src={std.fotoUrl}
                          alt={std.nama}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-300"
                        />
                        <div className="truncate">
                          <div className="font-bold truncate text-[11px]">{std.nama}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {std.kelas} • {std.noPeserta}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Petunjuk Singkat Ujian */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Petunjuk Pengerjaan Asesmen CBT PAI & BP:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>5 Menit per Soal:</strong> Tombol soal berikutnya terkunci selama 5 menit per butir soal.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Pilihan Ganda:</strong> Pilih satu jawaban terbaik (opsi A, B, C, atau D).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Auto-Save:</strong> Setiap jawaban Anda langsung tersimpan otomatis ke server sekolah.</span>
            </div>
          </div>
        </div>

        {/* Link Akses Pengawas & Bagikan Link (Discreet Footer Controls) */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-1 text-slate-500">
          {onOpenShare && (
            <button
              type="button"
              onClick={onOpenShare}
              className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-semibold cursor-pointer py-1 px-2.5 rounded-lg hover:bg-blue-50 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Bagikan Link Ujian ke Siswa (QR / WA)</span>
            </button>
          )}

          {onOpenGradesModal && (
            <button
              type="button"
              onClick={onOpenGradesModal}
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rekap Nilai Siswa {totalExamResults !== undefined && totalExamResults > 0 ? `(${totalExamResults})` : ''}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSupervisorModal}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-200 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Panel Pengawas / Guru (PIN: 123456)</span>
          </button>
        </div>

      </div>

      {/* Copyright Footer */}
      <footer className="text-center text-[11px] text-slate-400 mt-6">
        Sistem Asesmen Berbasis Komputer (CBT PAI & BP) &bull; Standar Asesmen Nasional Pusmendik
      </footer>

      {/* MODAL KONFIRMASI DATA PESERTA (Alur Resmi ANBK / CBT) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Konfirmasi Data Peserta Ujian</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200">
                <img
                  src={selectedStudent.fotoUrl}
                  alt={selectedStudent.nama}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                />
                <div className="truncate">
                  <h4 className="font-bold text-slate-900 text-base truncate">{selectedStudent.nama}</h4>
                  <div className="text-xs text-slate-600 space-y-0.5 mt-0.5">
                    <div>No. Peserta: <span className="font-mono font-bold text-blue-700">{selectedStudent.noPeserta}</span></div>
                    <div>NISN: {selectedStudent.nisn} &bull; Kelas: <strong>{selectedStudent.kelas}</strong></div>
                    <div className="truncate">{selectedStudent.sekolah}</div>
                  </div>
                </div>
              </div>

              {/* Detail Ujian */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Mata Pelajaran:</span>
                  <span className="font-bold text-emerald-850">Pendidikan Agama Islam & Budi Pekerti (PAI & BP)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Ruang & Sesi:</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.ruang} &bull; {selectedStudent.sesi}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Waktu per Butir:</span>
                  <span className="font-bold text-amber-700">5 Menit (Terkunci sebelum 5 menit)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Jumlah Soal:</span>
                  <span className="font-bold text-blue-700">{activeStudentQuestionCount} Butir Soal (Opsi A - D)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status Token:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VALID ({tokenInput})
                  </span>
                </div>
              </div>

              {/* Checkbox Integritas */}
              <label className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-amber-950 font-medium">
                  Saya menyatakan data diri di atas adalah benar, telah membaca tata tertib, dan siap mengerjakan ujian secara jujur dan mandiri.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal / Ubah Data
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStart}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>MULAI UJIAN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
