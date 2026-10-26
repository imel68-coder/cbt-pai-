/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Users, 
  PlusCircle, 
  RefreshCw, 
  Check, 
  Trash2, 
  BookOpen, 
  X, 
  FileCheck,
  UserPlus,
  Sparkles,
  Layers,
  ArrowRight,
  ListOrdered,
  HelpCircle,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  School,
  Lock,
  Unlock,
  BarChart3,
  Download,
  Printer,
  Pencil,
  FileSpreadsheet,
  Search,
  Award,
  Trophy
} from 'lucide-react';
import { 
  ExamTokenState, 
  Question, 
  Student, 
  QuestionType, 
  ClassRombel, 
  isQuestionAssignedToClass,
  ExamResult 
} from '../types/cbt';

interface SupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'aktivasiKelas' | 'siswa' | 'tambahSoal' | 'bankSoal' | 'token' | 'rekapNilai';
  onTabChange?: (tab: 'aktivasiKelas' | 'siswa' | 'tambahSoal' | 'bankSoal' | 'token' | 'rekapNilai') => void;
  tokenState: ExamTokenState;
  onUpdateToken: (newToken: string) => void;
  questions: Question[];
  onAddQuestion: (newQ: Question) => void;
  onUpdateQuestion?: (updatedQ: Question) => void;
  onDeleteQuestion?: (id: number) => void;
  onClearAllQuestions?: () => void;
  onRestoreDefaultQuestions?: () => void;
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent?: (updatedStudent: Student) => void;
  onDeleteStudent?: (id: string) => void;
  onClearAllStudents?: () => void;
  onRestoreDefaultStudents?: () => void;
  onSelectStudentForLogin: (student: Student) => void;
  onResetExamData: () => void;
  classes: ClassRombel[];
  onToggleClassActivation: (classId: string, forceActive?: boolean) => void;
  onToggleAllClasses: (activateAll: boolean) => void;
  onUpdateClassToken: (classId: string, newToken: string) => void;
  examResults?: ExamResult[];
  onDeleteExamResult?: (noPeserta: string, startTime: number) => void;
  onClearAllResults?: () => void;
  onLoadSampleResults?: () => void;
  onViewExamResultDetail?: (result: ExamResult) => void;
  cloudStatus?: {
    isConnected: boolean;
    isSyncing: boolean;
    lastSyncTime: number | null;
    error: string | null;
  };
  onPushAllToCloud?: () => Promise<{ success: boolean; message: string }>;
}

interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

const ConfirmDialogModal: React.FC<{
  config: ConfirmDialogConfig;
  onClose: () => void;
}> = ({ config, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-md w-full p-5 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${config.isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
            {config.isDestructive ? <AlertTriangle className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{config.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{config.message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            {config.cancelLabel || 'Batal'}
          </button>
          <button
            type="button"
            onClick={() => {
              config.onConfirm();
            }}
            className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm transition cursor-pointer ${
              config.isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {config.confirmLabel || 'Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditStudentDialogModal: React.FC<{
  student: Student;
  classes: ClassRombel[];
  onClose: () => void;
  onSave: (updated: Student) => void;
}> = ({ student, classes, onClose, onSave }) => {
  const [nama, setNama] = useState(student.nama);
  const [noPeserta, setNoPeserta] = useState(student.noPeserta);
  const [nisn, setNisn] = useState(student.nisn);
  const [kelas, setKelas] = useState(student.kelas);
  const [sekolah, setSekolah] = useState(student.sekolah);
  const [ruang, setRuang] = useState(student.ruang);
  const [sesi, setSesi] = useState(student.sesi);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !noPeserta.trim()) {
      return;
    }
    onSave({
      ...student,
      nama: nama.trim(),
      noPeserta: noPeserta.trim(),
      nisn: nisn.trim() || student.nisn,
      kelas,
      sekolah,
      ruang,
      sesi
    });
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-xl w-full p-5 space-y-4 my-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Edit Data Siswa</h4>
              <p className="text-xs text-slate-500 font-mono">{student.noPeserta} • {student.kelas}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Peserta Ujian *</label>
              <input
                type="text"
                value={noPeserta}
                onChange={(e) => setNoPeserta(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NISN Siswa</label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kelas / Rombel *</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.tingkat})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Asal Sekolah</label>
              <input
                type="text"
                value={sekolah}
                onChange={(e) => setSekolah(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ruang Lab Ujian</label>
              <input
                type="text"
                value={ruang}
                onChange={(e) => setRuang(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sesi Ujian</label>
              <input
                type="text"
                value={sesi}
                onChange={(e) => setSesi(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Data Siswa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditQuestionDialogModal: React.FC<{
  question: Question;
  classes: ClassRombel[];
  onClose: () => void;
  onSave: (updated: Question) => void;
}> = ({ question, classes, onClose, onSave }) => {
  const [subtest, setSubtest] = useState(question.subtest);
  const [difficulty, setDifficulty] = useState(question.difficulty);
  const [points, setPoints] = useState(question.points || 10);
  const [targetClasses, setTargetClasses] = useState<string[]>(
    question.targetClasses && question.targetClasses.length > 0
      ? question.targetClasses
      : question.targetClass
      ? question.targetClass.split(',').map((s) => s.trim())
      : ['SEMUA']
  );
  const [stimulus, setStimulus] = useState(question.stimulus || '');
  const [questionText, setQuestionText] = useState(question.questionText);
  const [explanation, setExplanation] = useState(question.explanation || '');

  // Options for PG & PGK (only A - D)
  const [optA, setOptA] = useState(question.options?.find((o) => o.key === 'A')?.text || '');
  const [optB, setOptB] = useState(question.options?.find((o) => o.key === 'B')?.text || '');
  const [optC, setOptC] = useState(question.options?.find((o) => o.key === 'C')?.text || '');
  const [optD, setOptD] = useState(question.options?.find((o) => o.key === 'D')?.text || '');

  // Correct answer for PG (single key)
  const [pgKey, setPgKey] = useState<string>(typeof question.correctAnswer === 'string' ? question.correctAnswer : 'A');

  // Correct answers for PGK (multiple keys)
  const [pgkKeys, setPgkKeys] = useState<string[]>(
    Array.isArray(question.correctAnswer) ? question.correctAnswer : ['A', 'B']
  );

  // Statements for Benar/Salah
  const [statements, setStatements] = useState(
    question.statements || [
      { id: 's1', text: '', correctAnswer: 'B' as const },
      { id: 's2', text: '', correctAnswer: 'S' as const }
    ]
  );

  // Matching pairs
  const [pairs, setPairs] = useState(
    question.matchingPremises
      ? question.matchingPremises.map((p) => ({ id: p.id, left: p.premise, right: p.correctMatch }))
      : [
          { id: 'm1', left: '', right: '' },
          { id: 'm2', left: '', right: '' }
        ]
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleToggleTargetClass = (name: string) => {
    if (name === 'SEMUA') {
      setTargetClasses(['SEMUA']);
      return;
    }
    setTargetClasses((prev) => {
      const withoutSemua = prev.filter((c) => c !== 'SEMUA');
      if (withoutSemua.includes(name)) {
        const next = withoutSemua.filter((c) => c !== name);
        return next.length === 0 ? ['SEMUA'] : next;
      } else {
        return [...withoutSemua, name];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setValidationError('Pertanyaan soal tidak boleh kosong.');
      return;
    }

    const targetClassesToSave = targetClasses.length === 0 || targetClasses.includes('SEMUA')
      ? ['SEMUA']
      : [...targetClasses];
    const targetClassStringToSave = targetClassesToSave.includes('SEMUA')
      ? 'SEMUA'
      : targetClassesToSave.join(', ');

    let updated: Question = {
      ...question,
      subtest,
      difficulty,
      points: Number(points) > 0 ? Number(points) : 10,
      targetClass: targetClassStringToSave,
      targetClasses: targetClassesToSave,
      stimulus: stimulus.trim() || undefined,
      questionText: questionText.trim(),
      explanation: explanation.trim() || 'Pembahasan telah diverifikasi oleh guru PAI & BP.'
    };

    if (question.type === 'pg') {
      if (!optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
        setValidationError('Semua butiran opsi A, B, C, dan D wajib diisi.');
        return;
      }
      updated.options = [
        { key: 'A', text: optA.trim() },
        { key: 'B', text: optB.trim() },
        { key: 'C', text: optC.trim() },
        { key: 'D', text: optD.trim() }
      ];
      updated.correctAnswer = pgKey;
    } else if (question.type === 'pgk') {
      if (!optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
        setValidationError('Semua butiran opsi A sampai D wajib diisi.');
        return;
      }
      if (pgkKeys.length < 2 || pgkKeys.length > 3) {
        setValidationError('Untuk PG Kompleks, wajib memilih 2 atau 3 kunci jawaban yang benar (A - D).');
        return;
      }
      updated.options = [
        { key: 'A', text: optA.trim() },
        { key: 'B', text: optB.trim() },
        { key: 'C', text: optC.trim() },
        { key: 'D', text: optD.trim() }
      ];
      updated.correctAnswer = [...pgkKeys].sort();
    } else if (question.type === 'bs') {
      const validStmts = statements.filter((s) => s.text.trim().length > 0);
      if (validStmts.length < 2) {
        setValidationError('Minimal harus ada 2 butir pernyataan.');
        return;
      }
      updated.statements = validStmts.map((s, idx) => ({
        id: `s_${question.id}_${idx}`,
        text: s.text.trim(),
        correctAnswer: s.correctAnswer
      }));
      updated.correctAnswer = validStmts.map((s) => s.correctAnswer).join(',');
    } else if (question.type === 'menjodohkan') {
      const validPairs = pairs.filter((p) => p.left.trim().length > 0 && p.right.trim().length > 0);
      if (validPairs.length < 2) {
        setValidationError('Minimal harus ada 2 pasangan menjodohkan.');
        return;
      }
      const premises = validPairs.map((p, idx) => ({
        id: `m_${question.id}_${idx}`,
        premise: p.left.trim(),
        correctMatch: p.right.trim()
      }));
      const choices = Array.from(new Set(validPairs.map((p) => p.right.trim())));
      updated.matchingPremises = premises;
      updated.matchingChoices = choices;
      updated.correctAnswer = premises.map((p) => `${p.id}:${p.correctMatch}`).join(',');
    }

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-3xl w-full p-5 space-y-4 my-6 flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Edit Butir Soal #{question.number}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {question.type === 'pg'
                    ? 'Pilihan Ganda (A-D)'
                    : question.type === 'pgk'
                    ? 'PG Kompleks (A-D)'
                    : question.type === 'bs'
                    ? 'Benar / Salah'
                    : 'Menjodohkan'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">{question.subtest} • Kurikulum PAI & BP</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Metadata: Subtes, Tingkat, Poin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran / Subtes:</label>
              <select
                value={subtest}
                onChange={(e) => setSubtest(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
              >
                <option value="Al-Qur'an dan Hadis">Al-Qur'an dan Hadis</option>
                <option value="Akidah">Akidah</option>
                <option value="Akhlak">Akhlak</option>
                <option value="Fikih">Fikih</option>
                <option value="Sejarah Peradaban Islam (SPI)">Sejarah Peradaban Islam (SPI)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tingkat Kesulitan:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
              >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="HOTS / Sulit">HOTS / Sulit</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bobot Poin / Skor:</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={points}
                  onChange={(e) => setPoints(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-amber-700"
                />
                <span className="font-bold text-slate-500 text-[11px] shrink-0">Poin</span>
              </div>
            </div>
          </div>

          {/* Target Kelas */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block font-bold text-slate-700 mb-1.5">Target Kelas / Rombel:</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleToggleTargetClass('SEMUA')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                  targetClasses.includes('SEMUA')
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🌐 Semua Kelas (Umum)
              </button>
              {classes.map((cls) => {
                const isSelected = !targetClasses.includes('SEMUA') && targetClasses.includes(cls.name);
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => handleToggleTargetClass(cls.name)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cls.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stimulus */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Stimulus / Teks Wacana / Hadis / Ayat (Opsional):
            </label>
            <textarea
              value={stimulus}
              onChange={(e) => setStimulus(e.target.value)}
              rows={2}
              placeholder="Kutipan ayat Al-Qur'an, Hadis Nabi, atau studi kasus..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Pertanyaan */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pertanyaan Soal *</label>
            <textarea
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                setValidationError(null);
              }}
              rows={3}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Opsi Jawaban (A - D) */}
          {(question.type === 'pg' || question.type === 'pgk') && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <label className="block font-bold text-slate-800">
                Butir Pilihan Jawaban (Hanya Opsi A sampai D) & Kunci Jawaban:
              </label>

              {[
                { key: 'A', val: optA, setVal: setOptA },
                { key: 'B', val: optB, setVal: setOptB },
                { key: 'C', val: optC, setVal: setOptC },
                { key: 'D', val: optD, setVal: setOptD }
              ].map((opt) => (
                <div key={opt.key} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {opt.key}
                  </div>
                  <input
                    type="text"
                    value={opt.val}
                    onChange={(e) => opt.setVal(e.target.value)}
                    placeholder={`Teks pilihan opsi ${opt.key}`}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {question.type === 'pg' ? (
                    <label className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                      pgKey === opt.key
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}>
                      <input
                        type="radio"
                        name="pg_key_modal"
                        checked={pgKey === opt.key}
                        onChange={() => setPgKey(opt.key)}
                        className="sr-only"
                      />
                      <span>{pgKey === opt.key ? '✓ Kunci' : 'Jadikan Kunci'}</span>
                    </label>
                  ) : (
                    <label className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                      pgkKeys.includes(opt.key)
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}>
                      <input
                        type="checkbox"
                        checked={pgkKeys.includes(opt.key)}
                        onChange={() => {
                          setPgkKeys((prev) =>
                            prev.includes(opt.key) ? prev.filter((k) => k !== opt.key) : [...prev, opt.key]
                          );
                        }}
                        className="sr-only"
                      />
                      <span>{pgkKeys.includes(opt.key) ? '✓ Kunci Benar' : 'Kunci'}</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pembahasan */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pembahasan / Solusi Soal:</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Soal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SupervisorModal: React.FC<SupervisorModalProps> = ({
  isOpen,
  onClose,
  initialTab,
  onTabChange,
  tokenState,
  onUpdateToken,
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onClearAllQuestions,
  onRestoreDefaultQuestions,
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onClearAllStudents,
  onRestoreDefaultStudents,
  onSelectStudentForLogin,
  onResetExamData,
  classes,
  onToggleClassActivation,
  onToggleAllClasses,
  onUpdateClassToken,
  examResults = [],
  onDeleteExamResult,
  onClearAllResults,
  onLoadSampleResults,
  onViewExamResultDetail,
  cloudStatus,
  onPushAllToCloud
}) => {
  type TabType = 'aktivasiKelas' | 'siswa' | 'tambahSoal' | 'bankSoal' | 'token' | 'rekapNilai';
  const [activeTab, setActiveTabState] = useState<TabType>(initialTab || 'aktivasiKelas');
  const [isPushingCloud, setIsPushingCloud] = useState(false);

  const handleForcePushToCloud = async () => {
    if (!onPushAllToCloud) return;
    setIsPushingCloud(true);
    try {
      const res = await onPushAllToCloud();
      if (res.success) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (e) {
      showToast('Gagal menyinkronkan data ke cloud', 'error');
    } finally {
      setIsPushingCloud(false);
    }
  };

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (onTabChange) onTabChange(tab);
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  const [customToken, setCustomToken] = useState(tokenState.token);
  const [tokenCopied, setTokenCopied] = useState(false);

  // --- STATE EDIT DATA SISWA ---
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // --- STATE EDIT BANK SOAL ---
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // --- STATE BOBOT POIN / SKOR SOAL ---
  const [customPoints, setCustomPoints] = useState<number>(10);

  // --- STATE FILTER & PENCARIAN REKAP NILAI SISWA ---
  const [filterNilaiKelas, setFilterNilaiKelas] = useState<string>('SEMUA');
  const [searchNilaiQuery, setSearchNilaiQuery] = useState<string>('');

  // --- IN-APP DIALOG & NOTIFICATION STATES (Safe in iframe without window.confirm/alert) ---
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [studentModalToEdit, setStudentModalToEdit] = useState<Student | null>(null);
  const [questionModalToEdit, setQuestionModalToEdit] = useState<Question | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- STATE FORM TAMBAH SISWA ---
  const [newNama, setNewNama] = useState('');
  const [newNoPeserta, setNewNoPeserta] = useState(() => `24-PAI-07-${Math.floor(100 + Math.random() * 900)}`);
  const [newNisn, setNewNisn] = useState('');
  const [newKelas, setNewKelas] = useState(classes[0]?.name || 'Kelas VII-A');
  const [newSekolah, setNewSekolah] = useState('SMP Negeri 1 Prestasi');
  const [newRuang, setNewRuang] = useState('Lab Komputer 01 (Ruang PAI A)');
  const [newSesi, setNewSesi] = useState('Sesi 1 (Pagi)');
  const [newFotoUrl, setNewFotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
  const [studentAddedSuccess, setStudentAddedSuccess] = useState(false);

  // --- STATE FORM TAMBAH SOAL (4 BENTUK SOAL) ---
  const [questionType, setQuestionType] = useState<QuestionType>('pg');
  // Dukungan pemilihan target kelas lebih dari satu (misal VII-A dan VII-B sekaligus)
  const [selectedTargetClasses, setSelectedTargetClasses] = useState<string[]>(['SEMUA']);
  const [subtest, setSubtest] = useState<string>("Al-Qur'an dan Hadis");
  const [difficulty, setDifficulty] = useState<Question['difficulty']>('Sedang');

  // Group kelas berdasarkan tingkatan (e.g. 'Kelas 7' => [VII-A, VII-B])
  const classesByTingkat = React.useMemo(() => {
    const groups: Record<string, ClassRombel[]> = {};
    classes.forEach((c) => {
      const t = c.tingkat || 'Umum';
      if (!groups[t]) groups[t] = [];
      groups[t].push(c);
    });
    return groups;
  }, [classes]);

  // Handler toggle target kelas satuan
  const handleToggleTargetClass = (className: string) => {
    if (className === 'SEMUA') {
      setSelectedTargetClasses(['SEMUA']);
      return;
    }

    setSelectedTargetClasses((prev) => {
      const withoutSemua = prev.filter((c) => c !== 'SEMUA');
      if (withoutSemua.includes(className)) {
        const next = withoutSemua.filter((c) => c !== className);
        return next.length === 0 ? ['SEMUA'] : next;
      } else {
        return [...withoutSemua, className];
      }
    });
  };

  // Handler toggle seluruh kelas dalam satu tingkatan yang sama (contoh: VII-A dan VII-B sekaligus)
  const handleToggleAllInTingkat = (tingkatKey: string) => {
    const rombelInTingkat = (classesByTingkat[tingkatKey] || []).map((c) => c.name);
    if (rombelInTingkat.length === 0) return;

    setSelectedTargetClasses((prev) => {
      const withoutSemua = prev.filter((c) => c !== 'SEMUA');
      const allSelected = rombelInTingkat.every((r) => withoutSemua.includes(r));
      if (allSelected) {
        // Hilangkan kelas tingkatan ini
        const remaining = withoutSemua.filter((r) => !rombelInTingkat.includes(r));
        return remaining.length === 0 ? ['SEMUA'] : remaining;
      } else {
        // Tambahkan seluruh rombel pada tingkatan ini
        return Array.from(new Set([...withoutSemua, ...rombelInTingkat]));
      }
    });
  };
  const [stimulus, setStimulus] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [explanation, setExplanation] = useState('');

  // 1. Bentuk PG (Pilihan Ganda Tunggal A sampai D)
  const [pgOptA, setPgOptA] = useState('');
  const [pgOptB, setPgOptB] = useState('');
  const [pgOptC, setPgOptC] = useState('');
  const [pgOptD, setPgOptD] = useState('');
  const [pgCorrectKey, setPgCorrectKey] = useState('A');

  // 2. Bentuk PGK (Pilihan Ganda Kompleks A sampai D - 2 atau 3 kunci benar)
  const [pgkOptA, setPgkOptA] = useState('');
  const [pgkOptB, setPgkOptB] = useState('');
  const [pgkOptC, setPgkOptC] = useState('');
  const [pgkOptD, setPgkOptD] = useState('');
  const [pgkCorrectKeys, setPgkCorrectKeys] = useState<string[]>(['A', 'B']);

  // 3. Bentuk Benar/Salah (B/S)
  const [statements, setStatements] = useState<{ id: string; text: string; correctAnswer: 'B' | 'S' }[]>([
    { id: 's1', text: '', correctAnswer: 'B' },
    { id: 's2', text: '', correctAnswer: 'S' },
    { id: 's3', text: '', correctAnswer: 'B' }
  ]);

  // 4. Bentuk Menjodohkan (Matching)
  const [matchingPairs, setMatchingPairs] = useState<{ id: string; leftText: string; rightText: string }[]>([
    { id: 'm1', leftText: '', rightText: '' },
    { id: 'm2', leftText: '', rightText: '' },
    { id: 'm3', leftText: '', rightText: '' }
  ]);

  const [addQuestionSuccess, setAddQuestionSuccess] = useState(false);

  // Filter bank soal
  const [filterType, setFilterType] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Handler: Mulai Edit Siswa
  const handleStartEditStudent = (std: Student) => {
    setEditingStudent(std);
    setNewNama(std.nama);
    setNewNoPeserta(std.noPeserta);
    setNewNisn(std.nisn);
    setNewKelas(std.kelas);
    setNewSekolah(std.sekolah);
    setNewRuang(std.ruang);
    setNewSesi(std.sesi);
    setNewFotoUrl(std.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
    setActiveTab('siswa');
  };

  // Handler: Batal Edit Siswa
  const handleCancelEditStudent = () => {
    setEditingStudent(null);
    setNewNama('');
    setNewNoPeserta(`24-PAI-07-${Math.floor(100 + Math.random() * 900)}`);
    setNewNisn('');
  };

  // Handler: Tambah / Perbarui Data Siswa
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim() || !newNoPeserta.trim()) {
      showToast('Nama siswa dan nomor peserta wajib diisi.', 'error');
      return;
    }

    if (editingStudent && onUpdateStudent) {
      const updated: Student = {
        ...editingStudent,
        nama: newNama.trim(),
        noPeserta: newNoPeserta.trim(),
        nisn: newNisn.trim() || editingStudent.nisn,
        kelas: newKelas,
        sekolah: newSekolah,
        ruang: newRuang,
        sesi: newSesi,
        fotoUrl: newFotoUrl
      };
      onUpdateStudent(updated);
      setEditingStudent(null);
      setStudentAddedSuccess(true);
      showToast(`Data siswa "${updated.nama}" berhasil diperbarui`, 'success');
      setNewNama('');
      setNewNoPeserta(`24-PAI-07-${Math.floor(100 + Math.random() * 900)}`);
      setNewNisn('');
      setTimeout(() => setStudentAddedSuccess(false), 3000);
      return;
    }

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      nama: newNama.trim(),
      noPeserta: newNoPeserta.trim(),
      nisn: newNisn.trim() || `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      kelas: newKelas,
      sekolah: newSekolah,
      ruang: newRuang,
      sesi: newSesi,
      fotoUrl: newFotoUrl
    };

    onAddStudent(newStudent);
    setStudentAddedSuccess(true);
    showToast(`Siswa "${newStudent.nama}" berhasil didaftarkan`, 'success');
    setNewNama('');
    setNewNoPeserta(`24-PAI-07-${Math.floor(100 + Math.random() * 900)}`);
    setNewNisn('');
    setTimeout(() => setStudentAddedSuccess(false), 3000);
  };

  // Handler: Toggle Kunci PGK
  const handleTogglePgkKey = (key: string) => {
    setPgkCorrectKeys((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // Handler: Mulai Edit Soal dari Bank Soal
  const handleStartEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQuestionType(q.type);
    setSubtest(q.subtest);
    setDifficulty(q.difficulty);
    setCustomPoints(q.points || 10);
    setStimulus(q.stimulus || '');
    setQuestionText(q.questionText);
    setExplanation(q.explanation || '');

    if (q.targetClasses && q.targetClasses.length > 0) {
      setSelectedTargetClasses(q.targetClasses);
    } else if (q.targetClass) {
      setSelectedTargetClasses(q.targetClass.split(',').map((s) => s.trim()));
    } else {
      setSelectedTargetClasses(['SEMUA']);
    }

    if (q.type === 'pg' && q.options) {
      setPgOptA(q.options.find((o) => o.key === 'A')?.text || '');
      setPgOptB(q.options.find((o) => o.key === 'B')?.text || '');
      setPgOptC(q.options.find((o) => o.key === 'C')?.text || '');
      setPgOptD(q.options.find((o) => o.key === 'D')?.text || '');
      setPgCorrectKey(typeof q.correctAnswer === 'string' ? q.correctAnswer : 'A');
    } else if (q.type === 'pgk' && q.options) {
      setPgkOptA(q.options.find((o) => o.key === 'A')?.text || '');
      setPgkOptB(q.options.find((o) => o.key === 'B')?.text || '');
      setPgkOptC(q.options.find((o) => o.key === 'C')?.text || '');
      setPgkOptD(q.options.find((o) => o.key === 'D')?.text || '');
      setPgkCorrectKeys(Array.isArray(q.correctAnswer) ? q.correctAnswer : ['A', 'B']);
    } else if (q.type === 'bs' && q.statements) {
      setStatements(
        q.statements.map((s) => ({ id: s.id, text: s.text, correctAnswer: s.correctAnswer }))
      );
    } else if (q.type === 'menjodohkan' && q.matchingPremises) {
      setMatchingPairs(
        q.matchingPremises.map((p) => ({ id: p.id, leftText: p.premise, rightText: p.correctMatch }))
      );
    }
    setActiveTab('tambahSoal');
  };

  // Handler: Batal Edit Soal
  const handleCancelEditQuestion = () => {
    setEditingQuestion(null);
    setStimulus('');
    setQuestionText('');
    setExplanation('');
    setCustomPoints(10);
    setPgOptA('');
    setPgOptB('');
    setPgOptC('');
    setPgOptD('');
    setPgCorrectKey('A');
    setPgkOptA('');
    setPgkOptB('');
    setPgkOptC('');
    setPgkOptD('');
  };

  // Handler: Simpan Soal Baru / Perbarui Soal
  const handleCreateQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      showToast('Pertanyaan soal tidak boleh kosong.', 'error');
      return;
    }

    let newQ: Question | null = null;
    const baseId = editingQuestion ? editingQuestion.id : Date.now();
    const newNumber = editingQuestion ? editingQuestion.number : (questions.length + 1);

    const targetClassesToSave = selectedTargetClasses.length === 0 || selectedTargetClasses.includes('SEMUA')
      ? ['SEMUA']
      : [...selectedTargetClasses];
    const targetClassStringToSave = targetClassesToSave.includes('SEMUA')
      ? 'SEMUA'
      : targetClassesToSave.join(', ');

    // 1. Bentuk Pilihan Ganda (PG A sampai D)
    if (questionType === 'pg') {
      if (!pgOptA || !pgOptB || !pgOptC || !pgOptD) {
        showToast('Harap lengkapi semua butiran opsi A, B, C, dan D untuk soal Pilihan Ganda.', 'error');
        return;
      }
      newQ = {
        id: baseId,
        number: newNumber,
        subtest,
        type: 'pg',
        targetClass: targetClassStringToSave,
        targetClasses: targetClassesToSave,
        difficulty,
        points: Number(customPoints) > 0 ? Number(customPoints) : 10,
        stimulus: stimulus.trim() || undefined,
        questionText: questionText.trim(),
        options: [
          { key: 'A', text: pgOptA.trim() },
          { key: 'B', text: pgOptB.trim() },
          { key: 'C', text: pgOptC.trim() },
          { key: 'D', text: pgOptD.trim() }
        ],
        correctAnswer: pgCorrectKey,
        explanation: explanation.trim() || 'Kunci jawaban telah diverifikasi oleh guru pengampu PAI & BP.'
      };
    }

    // 2. Bentuk Pilihan Ganda Kompleks (PGK A sampai D - 2 atau 3 Kunci Benar)
    else if (questionType === 'pgk') {
      if (!pgkOptA || !pgkOptB || !pgkOptC || !pgkOptD) {
        showToast('Harap lengkapi seluruh butiran opsi A sampai D untuk Pilihan Ganda Kompleks.', 'error');
        return;
      }
      if (pgkCorrectKeys.length < 2 || pgkCorrectKeys.length > 3) {
        showToast('Untuk butiran Pilihan Ganda Kompleks, Anda wajib memilih 2 atau 3 kunci jawaban yang benar (dari pilihan A - D).', 'error');
        return;
      }
      newQ = {
        id: baseId,
        number: newNumber,
        subtest,
        type: 'pgk',
        targetClass: targetClassStringToSave,
        targetClasses: targetClassesToSave,
        difficulty,
        points: Number(customPoints) > 0 ? Number(customPoints) : 10,
        stimulus: stimulus.trim() || undefined,
        questionText: questionText.trim(),
        options: [
          { key: 'A', text: pgkOptA.trim() },
          { key: 'B', text: pgkOptB.trim() },
          { key: 'C', text: pgkOptC.trim() },
          { key: 'D', text: pgkOptD.trim() }
        ],
        correctAnswer: [...pgkCorrectKeys].sort(),
        explanation: explanation.trim() || 'Pembahasan kunci PGK telah diverifikasi oleh guru PAI & BP.'
      };
    }

    // 3. Bentuk Benar / Salah (B/S)
    else if (questionType === 'bs') {
      const validStmts = statements.filter((s) => s.text.trim().length > 0);
      if (validStmts.length < 2) {
        showToast('Minimal harus mengisi 2 baris pernyataan untuk soal Benar / Salah.', 'error');
        return;
      }
      newQ = {
        id: baseId,
        number: newNumber,
        subtest,
        type: 'bs',
        targetClass: targetClassStringToSave,
        targetClasses: targetClassesToSave,
        difficulty,
        points: Number(customPoints) > 0 ? Number(customPoints) : 10,
        stimulus: stimulus.trim() || undefined,
        questionText: questionText.trim(),
        statements: validStmts.map((s, idx) => ({
          id: `s_${baseId}_${idx}`,
          text: s.text.trim(),
          correctAnswer: s.correctAnswer
        })),
        correctAnswer: validStmts.map((s) => s.correctAnswer).join(','),
        explanation: explanation.trim() || 'Pembahasan pernyataan Benar/Salah telah diverifikasi.'
      };
    }

    // 4. Bentuk Menjodohkan (Matching)
    else if (questionType === 'menjodohkan') {
      const validPairs = matchingPairs.filter(
        (p) => p.leftText.trim().length > 0 && p.rightText.trim().length > 0
      );
      if (validPairs.length < 2) {
        showToast('Harap isi minimal 2 pasangan Kolom Kiri dan Kolom Kanan untuk soal Menjodohkan.', 'error');
        return;
      }

      const premises = validPairs.map((p, idx) => ({
        id: `m_${baseId}_${idx}`,
        premise: p.leftText.trim(),
        correctMatch: p.rightText.trim()
      }));

      // Choices in right column is unique set of rightTexts
      const choices = Array.from(new Set(validPairs.map((p) => p.rightText.trim())));

      newQ = {
        id: baseId,
        number: newNumber,
        subtest,
        type: 'menjodohkan',
        targetClass: targetClassStringToSave,
        targetClasses: targetClassesToSave,
        difficulty,
        points: Number(customPoints) > 0 ? Number(customPoints) : 10,
        stimulus: stimulus.trim() || undefined,
        questionText: questionText.trim(),
        matchingPremises: premises,
        matchingChoices: choices,
        correctAnswer: premises.map((p) => `${p.id}:${p.correctMatch}`).join(','),
        explanation: explanation.trim() || 'Kunci pasangan konsep telah diverifikasi oleh pengajar.'
      };
    }

    if (newQ) {
      if (editingQuestion && onUpdateQuestion) {
        onUpdateQuestion(newQ);
        setEditingQuestion(null);
        setActiveTab('bankSoal');
        showToast(`Soal nomor #${newQ.number} berhasil diperbarui`, 'success');
      } else {
        onAddQuestion(newQ);
        showToast(`Soal baru nomor #${newQ.number} berhasil ditambahkan`, 'success');
      }
      setAddQuestionSuccess(true);
      setQuestionText('');
      setStimulus('');
      setExplanation('');
      setPgOptA('');
      setPgOptB('');
      setPgOptC('');
      setPgOptD('');
      setPgkOptA('');
      setPgkOptB('');
      setPgkOptC('');
      setPgkOptD('');
      setTimeout(() => setAddQuestionSuccess(false), 3000);
    }
  };

  // --- REKAP & DOWNLOAD NILAI SISWA LOGIC ---
  const filteredExamResults = React.useMemo(() => {
    return examResults.filter((r) => {
      if (filterNilaiKelas !== 'SEMUA') {
        const matchesClass = r.student.kelas === filterNilaiKelas || r.student.kelas.includes(filterNilaiKelas);
        if (!matchesClass) return false;
      }
      if (searchNilaiQuery.trim()) {
        const query = searchNilaiQuery.toLowerCase().trim();
        const matchesQuery =
          r.student.nama.toLowerCase().includes(query) ||
          r.student.noPeserta.toLowerCase().includes(query) ||
          r.student.nisn.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [examResults, filterNilaiKelas, searchNilaiQuery]);

  const examStats = React.useMemo(() => {
    if (filteredExamResults.length === 0) {
      return { total: 0, avgScale: 0, avgPercent: 0, passedCount: 0, failedCount: 0, highest: 0, lowest: 0 };
    }
    const total = filteredExamResults.length;
    const sumScale = filteredExamResults.reduce((acc, r) => acc + r.scaleScore, 0);
    const sumPercent = filteredExamResults.reduce((acc, r) => acc + r.percentage, 0);
    const passedCount = filteredExamResults.filter((r) => r.isPassed).length;
    const failedCount = total - passedCount;
    const highest = Math.max(...filteredExamResults.map((r) => r.scaleScore));
    const lowest = Math.min(...filteredExamResults.map((r) => r.scaleScore));

    return {
      total,
      avgScale: Math.round(sumScale / total),
      avgPercent: Math.round(sumPercent / total),
      passedCount,
      failedCount,
      highest,
      lowest
    };
  }, [filteredExamResults]);

  // Handler: Download Nilai Siswa ke CSV / Excel
  const handleDownloadGradesCsv = () => {
    if (filteredExamResults.length === 0) {
      showToast('Tidak ada data nilai siswa untuk di-download.', 'info');
      return;
    }

    const headers = [
      'No',
      'Nomor Peserta',
      'Nama Siswa',
      'NISN',
      'Kelas',
      'Asal Sekolah',
      'Ruang',
      'Sesi',
      'Nilai Skala CBT (200-900)',
      'Nilai Persentase (%)',
      'Total Poin Diperoleh',
      'Poin Maksimal',
      'Jumlah Soal Benar',
      'Jumlah Soal Salah',
      'Jumlah Soal Kosong',
      'Status Kelulusan',
      'Durasi Pengerjaan',
      'Waktu Selesai'
    ];

    const rows = filteredExamResults.map((r, index) => {
      const durationMin = Math.floor(r.durationSecondsUsed / 60);
      const durationSec = r.durationSecondsUsed % 60;
      const completedDate = new Date(r.endTime).toLocaleString('id-ID');
      const maxPts = r.maxPoints || 100;

      return [
        index + 1,
        `"${r.student.noPeserta}"`,
        `"${r.student.nama.replace(/"/g, '""')}"`,
        `"${r.student.nisn}"`,
        `"${r.student.kelas}"`,
        `"${r.student.sekolah}"`,
        `"${r.student.ruang}"`,
        `"${r.student.sesi}"`,
        r.scaleScore,
        `${r.percentage}%`,
        r.rawScore,
        maxPts,
        r.correctCount,
        r.wrongCount,
        r.unansweredCount,
        r.isPassed ? 'TUNTAS (LULUS)' : 'BELUM TUNTAS (REMEDIAL)',
        `"${durationMin}m ${durationSec}s"`,
        `"${completedDate}"`
      ].join(',');
    });

    // Add UTF-8 BOM so Microsoft Excel renders indonesian text properly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    const classTag = filterNilaiKelas === 'SEMUA' ? 'Semua_Kelas' : filterNilaiKelas.replace(/\s+/g, '_');
    link.setAttribute('download', `Rekap_Nilai_CBT_PAI_BP_${classTag}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateRandomToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'PAI';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomToken(result);
    onUpdateToken(result);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchType = filterType === 'all' || q.type === filterType;
    let matchClass = true;
    if (filterClass === 'all') {
      matchClass = true;
    } else if (filterClass === 'SEMUA') {
      matchClass = !q.targetClass || q.targetClass === 'SEMUA' || Boolean(q.targetClasses && q.targetClasses.includes('SEMUA'));
    } else if (filterClass.startsWith('tingkat:')) {
      const tingkatKey = filterClass.replace('tingkat:', '');
      const rombelNames = (classesByTingkat[tingkatKey] || []).map((c) => c.name);
      matchClass = isQuestionAssignedToClass(q, 'SEMUA') || rombelNames.some((r) => isQuestionAssignedToClass(q, r));
    } else {
      matchClass = isQuestionAssignedToClass(q, filterClass);
    }
    return matchType && matchClass;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col max-h-[92vh]">
        
        {/* Header Portal Guru */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">Portal Guru & Pengawas CBT PAI & BP</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Panel Administrator
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Kelola siswa, rilis token ujian, dan kelola butir soal PAI & BP (Opsi A - D)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Cloud Synchronization Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/60 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${cloudStatus?.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-bold">
              Cloud Firebase: {cloudStatus?.isConnected ? 'Terhubung (Real-time Aktif)' : 'Menghubungkan...'}
            </span>
            <span className="text-[11px] text-indigo-200 hidden lg:inline">
              • Setiap perubahan token, rombel, bank soal, dan siswa otomatis tersinkron ke seluruh HP siswa tanpa perlu refresh.
            </span>
          </div>

          {onPushAllToCloud && (
            <button
              type="button"
              onClick={handleForcePushToCloud}
              disabled={isPushingCloud}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              title="Kirim seluruh data lokal laptop (rombel, siswa, bank soal, token) ke Cloud agar HP siswa langsung sinkron"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPushingCloud ? 'animate-spin' : ''}`} />
              <span>{isPushingCloud ? 'Menyinkronkan...' : 'Sinkronkan Laptop ke HP Siswa'}</span>
            </button>
          )}
        </div>

        {/* Tab Navigasi Utama */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('aktivasiKelas')}
            className={`pb-3 px-3.5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'aktivasiKelas'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Aktivasi Ujian (6 Rombel)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {classes.filter((c) => c.isActive).length}/{classes.length} Aktif
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('siswa')}
            className={`pb-3 px-3.5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'siswa'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Siswa ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tambahSoal')}
            className={`pb-3 px-3.5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'tambahSoal'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {editingQuestion ? (
              <Pencil className="w-4 h-4 text-amber-500" />
            ) : (
              <PlusCircle className="w-4 h-4 text-emerald-600" />
            )}
            <span>{editingQuestion ? `Edit Soal #${editingQuestion.number}` : 'Buat Soal (4 Bentuk)'}</span>
            {editingQuestion && (
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-extrabold">
                Mode Edit
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bankSoal')}
            className={`pb-3 px-3.5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'bankSoal'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bank Soal Aktif ({questions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rekapNilai')}
            className={`pb-3 px-3.5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'rekapNilai'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Rekap & Download Nilai</span>
            {examResults.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {examResults.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('token')}
            className={`pb-3 px-3.5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'token'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span>Token & Pengaturan Sesi</span>
          </button>
        </div>

        {/* Tab Body Container */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 0: AKTIVASI UJIAN 6 ROMBEL KELAS */}
          {activeTab === 'aktivasiKelas' && (
            <div className="space-y-6">
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-semibold">
                      Sistem Multi-Rombel (6 Kelas)
                    </span>
                    <span className="text-xs text-emerald-300 font-bold">
                      ● {classes.filter((c) => c.isActive).length} dari {classes.length} Rombel Ujian Dibuka
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mt-1">
                    Aktivasi & Kontrol Ujian per Kelas (6 Rombel)
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                    Setelah guru memasukkan soal per kelas, cukup aktifkan tombol kelas di bawah ini ketika jadwal ujian dimulai. Siswa pada rombel yang belum diaktifkan akan diblokir otomatis dari login ujian.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleAllClasses(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Aktifkan Semua (6 Kelas)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleAllClasses(false)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Kunci / Nonaktifkan Semua</span>
                  </button>
                </div>
              </div>

              {/* 6 Rombel Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls, idx) => {
                  const studentCount = students.filter(
                    (s) => s.kelas.toLowerCase() === cls.name.toLowerCase() || s.kelas.includes(cls.code)
                  ).length;
                  const questionCount = questions.filter((q) => isQuestionAssignedToClass(q, cls.name)).length;
                  const exclusiveQuestionCount = questions.filter((q) => {
                    if (q.targetClasses && q.targetClasses.length > 0) {
                      return !q.targetClasses.includes('SEMUA') && q.targetClasses.some((tc) => tc.toLowerCase() === cls.name.toLowerCase() || cls.name.toLowerCase().includes(tc.toLowerCase()));
                    }
                    return q.targetClass && q.targetClass !== 'SEMUA' && (q.targetClass.toLowerCase() === cls.name.toLowerCase() || cls.name.toLowerCase().includes(q.targetClass.toLowerCase()));
                  }).length;

                  return (
                    <div
                      key={cls.id}
                      className={`rounded-2xl border transition-all p-4.5 flex flex-col justify-between shadow-xs ${
                        cls.isActive
                          ? 'bg-white border-emerald-400 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50/90 border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Card Top: Code, Name & Status Badge */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-blue-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                                0{idx + 1}
                              </span>
                              <div>
                                <h5 className="font-extrabold text-base text-slate-900 leading-tight">
                                  {cls.name}
                                </h5>
                                <span className="text-[10px] text-slate-500 font-semibold">
                                  {cls.tingkat} • Rombel {idx + 1}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                cls.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                              }`}
                            />
                            <span
                              className={`text-[10px] font-bold ${
                                cls.isActive ? 'text-emerald-700' : 'text-slate-500'
                              }`}
                            >
                              {cls.isActive ? 'AKTIF' : 'NONAKTIF'}
                            </span>
                          </div>
                        </div>

                        {/* Title of exam */}
                        <div className="mt-2.5 mb-3">
                          <span className="text-[11px] font-semibold text-slate-700 block truncate">
                            {cls.examTitle}
                          </span>
                        </div>

                        {/* Stats Info */}
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/80">
                            <span className="text-[10px] text-slate-500 font-medium block">Siswa Rombel</span>
                            <div className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                              <Users className="w-3.5 h-3.5 text-blue-600" />
                              <span>{studentCount} Siswa</span>
                            </div>
                          </div>
                          <div className="bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/80">
                            <span className="text-[10px] text-slate-500 font-medium block">Soal Ujian</span>
                            <div className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{questionCount} Soal</span>
                            </div>
                            {exclusiveQuestionCount > 0 && (
                              <span className="text-[9px] text-indigo-700 font-bold block">
                                ({exclusiveQuestionCount} soal khusus)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Per-class token */}
                        <div className="mb-3.5 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-amber-900 uppercase">
                              Token Ujian Kelas:
                            </span>
                            <span className="text-[9px] text-amber-700 font-mono">
                              Utama: {tokenState.token}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={cls.token}
                            onChange={(e) => onUpdateClassToken(cls.id, e.target.value.toUpperCase())}
                            maxLength={10}
                            className="w-full px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold uppercase text-amber-950 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            placeholder="TOKEN KELAS"
                          />
                        </div>
                      </div>

                      {/* Toggle Actuator Button */}
                      <div className="pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => onToggleClassActivation(cls.id)}
                          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
                            cls.isActive
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                          }`}
                        >
                          {cls.isActive ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-200" />
                              <span>Ujian AKTIF (Klik Nonaktifkan)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-slate-500" />
                              <span>NONAKTIF (Klik Buka Ujian)</span>
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-center text-slate-500 mt-1">
                          {cls.isActive
                            ? '✓ Siswa kelas ini bisa login & ujian'
                            : '✕ Siswa kelas ini diblokir dari login'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* TAB 1: MANAJEMEN SISWA (MASUKKAN & KELOLA SISWA) */}
          {activeTab === 'siswa' && (
            <div className="space-y-6">
              {/* Form Tambah / Edit Siswa */}
              <div className={`rounded-2xl p-5 border transition-all ${
                editingStudent
                  ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    {editingStudent ? (
                      <Pencil className="w-5 h-5 text-amber-600" />
                    ) : (
                      <UserPlus className="w-5 h-5 text-blue-700" />
                    )}
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {editingStudent ? `Mode Edit: Perbarui Data Siswa (${editingStudent.nama})` : 'Formulir Masukkan Siswa Baru'}
                    </h4>
                    {editingStudent && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Edit Mode
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {editingStudent
                      ? 'Perubahan data siswa langsung tersimpan ke sistem ujian'
                      : 'Siswa yang ditambahkan langsung bisa login ujian di Dashboard'}
                  </span>
                </div>

                {studentAddedSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Data siswa berhasil disimpan dan diperbarui!
                  </div>
                )}

                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nama Lengkap Siswa *
                      </label>
                      <input
                        type="text"
                        value={newNama}
                        onChange={(e) => setNewNama(e.target.value)}
                        placeholder="Contoh: Muhammad Rizky Pratama"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nomor Peserta Ujian *
                      </label>
                      <input
                        type="text"
                        value={newNoPeserta}
                        onChange={(e) => setNewNoPeserta(e.target.value)}
                        placeholder="Contoh: 24-PAI-07-0099"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-blue-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        NISN Siswa
                      </label>
                      <input
                        type="text"
                        value={newNisn}
                        onChange={(e) => setNewNisn(e.target.value)}
                        placeholder="Contoh: 0081234567"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Pilih Kelas / Rombel *
                      </label>
                      <select
                        value={newKelas}
                        onChange={(e) => setNewKelas(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      >
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.name}>
                            {cls.name} ({cls.tingkat})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Asal Sekolah
                      </label>
                      <input
                        type="text"
                        value={newSekolah}
                        onChange={(e) => setNewSekolah(e.target.value)}
                        placeholder="Nama Sekolah"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Ruang Lab & Sesi
                      </label>
                      <input
                        type="text"
                        value={newRuang}
                        onChange={(e) => setNewRuang(e.target.value)}
                        placeholder="Lab Komputer 01"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    {editingStudent && (
                      <button
                        type="button"
                        onClick={handleCancelEditStudent}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Batal Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`px-5 py-2.5 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer ${
                        editingStudent
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {editingStudent ? <Pencil className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      <span>{editingStudent ? 'Simpan Perubahan Siswa' : 'Simpan Siswa ke Database Ujian'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Siswa yang Terdaftar */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Daftar Siswa Terdaftar ({students.length} Siswa)
                    </h4>
                    <span className="text-xs text-slate-500 font-normal">
                      Klik ikon pensil untuk mengedit data siswa, ikon sampah untuk menghapus, atau tombol "Pilih Login"
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onClearAllStudents && students.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDialog({
                            title: 'Hapus Seluruh Data Siswa',
                            message: 'Apakah Anda yakin ingin menghapus SELURUH data siswa yang ada? Data siswa yang terhapus tidak dapat dikembalikan kecuali memuat ulang siswa contoh.',
                            confirmLabel: 'Ya, Hapus Semua Siswa',
                            cancelLabel: 'Batal',
                            isDestructive: true,
                            onConfirm: () => {
                              onClearAllStudents();
                              setConfirmDialog(null);
                              showToast('Seluruh data siswa berhasil dihapus', 'info');
                            }
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Semua Siswa</span>
                      </button>
                    )}
                    {onRestoreDefaultStudents && (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDialog({
                            title: 'Muat Siswa Contoh',
                            message: 'Muat kembali daftar siswa contoh PAI & BP untuk simulasi ujian?',
                            confirmLabel: 'Ya, Muat Siswa',
                            cancelLabel: 'Batal',
                            isDestructive: false,
                            onConfirm: () => {
                              onRestoreDefaultStudents();
                              setConfirmDialog(null);
                              showToast('Daftar siswa contoh berhasil dimuat', 'success');
                            }
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Muat Siswa Contoh</span>
                      </button>
                    )}
                  </div>
                </div>

                {students.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">Belum ada data siswa terdaftar</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Silakan masukkan siswa baru melalui formulir di atas, atau klik "Muat Siswa Contoh" untuk memasukkan akun demo.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto p-1">
                    {students.map((std) => (
                      <div
                        key={std.id}
                        className={`p-3.5 rounded-xl border shadow-xs flex items-center justify-between gap-3 transition ${
                          editingStudent?.id === std.id
                            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300'
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <img
                            src={std.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                            alt={std.nama}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="truncate">
                            <strong className="text-xs font-bold text-slate-900 block truncate">
                              {std.nama}
                            </strong>
                            <div className="text-[11px] text-slate-500 space-x-1.5 font-mono">
                              <span className="text-blue-700 font-bold">{std.noPeserta}</span>
                              <span>•</span>
                              <span>{std.kelas}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">{std.sekolah}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setStudentModalToEdit(std)}
                            className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                            title="Edit Data Siswa"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectStudentForLogin(std);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-[11px] rounded-lg transition cursor-pointer"
                            title="Gunakan akun siswa ini di halaman login"
                          >
                            Pilih Login
                          </button>
                          {onDeleteStudent && (
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  title: 'Hapus Data Siswa',
                                  message: `Apakah Anda yakin ingin menghapus data siswa "${std.nama}" (${std.noPeserta} - ${std.kelas})? Siswa ini tidak akan bisa login lagi ke ujian.`,
                                  confirmLabel: 'Ya, Hapus Siswa',
                                  cancelLabel: 'Batal',
                                  isDestructive: true,
                                  onConfirm: () => {
                                    onDeleteStudent(std.id);
                                    setConfirmDialog(null);
                                    showToast(`Siswa "${std.nama}" berhasil dihapus`, 'success');
                                  }
                                });
                              }}
                              className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                              title="Hapus Data Siswa"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TAMBAH SOAL BARU (4 BENTUK SOAL) */}
          {activeTab === 'tambahSoal' && (
            <div className="space-y-5">
              {/* Selector 4 Bentuk Soal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Bentuk Soal yang Ingin Dimasukkan:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuestionType('pg')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      questionType === 'pg'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <span>Pilihan Ganda (PG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuestionType('pgk')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      questionType === 'pgk'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span>PG Kompleks (2-3 Kunci)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuestionType('bs')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      questionType === 'bs'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                    <span>Benar / Salah (B/S)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuestionType('menjodohkan')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      questionType === 'menjodohkan'
                        ? 'bg-amber-50 border-amber-600 text-amber-950 shadow-sm ring-1 ring-amber-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">4</span>
                    <span>Menjodohkan</span>
                  </button>
                </div>
              </div>

              {editingQuestion && (
                <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-center justify-between text-xs text-amber-950 font-bold shadow-xs">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-amber-600" />
                    <span>Mode Edit Soal: Memperbarui Butir #{editingQuestion.number} ({editingQuestion.subtest})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEditQuestion}
                    className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg text-[11px] font-bold cursor-pointer"
                  >
                    Batal Edit (Buat Baru)
                  </button>
                </div>
              )}

              {addQuestionSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Soal berhasil disimpan ke bank soal ujian! (Total soal sekarang: {questions.length})
                </div>
              )}

              {/* Form Input Soal */}
              <form onSubmit={handleCreateQuestionSubmit} className="space-y-4 text-xs">
                {/* 1. Meta Soal (Subtes, Kesulitan, dan Bobot Skor/Poin) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran / Subtes:</label>
                    <select
                      value={subtest}
                      onChange={(e) => setSubtest(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
                    >
                      <option value="Al-Qur'an dan Hadis">Al-Qur'an dan Hadis</option>
                      <option value="Akidah">Akidah</option>
                      <option value="Akhlak">Akhlak</option>
                      <option value="Fikih">Fikih</option>
                      <option value="Sejarah Peradaban Islam (SPI)">Sejarah Peradaban Islam (SPI)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tingkat Kesulitan:</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
                    >
                      <option value="Mudah">Mudah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="HOTS / Sulit">HOTS / Sulit</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">Bobot Poin / Skor:</label>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                        {customPoints} Poin
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={customPoints}
                        onChange={(e) => setCustomPoints(Math.max(1, parseInt(e.target.value) || 1))}
                        required
                        className="w-16 px-2.5 py-2 bg-white border border-slate-300 rounded-lg font-bold text-center text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                      <div className="flex items-center gap-1 flex-wrap">
                        {[5, 10, 15, 20, 25].map((pts) => (
                          <button
                            key={pts}
                            type="button"
                            onClick={() => setCustomPoints(pts)}
                            className={`px-1.5 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                              customPoints === pts
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {pts}p
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Target Kelas & Rombel (Bisa Pilih > 1 Kelas Tingkatan yang Sama) */}
                <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 p-4 rounded-2xl border-2 border-blue-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-blue-200/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4 text-blue-700" />
                        <label className="font-extrabold text-xs sm:text-sm text-slate-900">
                          Target Kelas & Rombel (Multi-Pilih Tingkatan yang Sama)
                        </label>
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          Fitur Efisiensi Guru
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Pilih <strong>lebih dari satu rombel</strong> dalam tingkatan yang sama (contoh: <strong>Kelas VII-A dan VII-B sekaligus</strong>) agar tidak perlu membuat soal berulang-ulang untuk tingkatan yang sama.
                      </p>
                    </div>

                    {/* Tombol Cepat Reset ke Semua Kelas */}
                    <button
                      type="button"
                      onClick={() => setSelectedTargetClasses(['SEMUA'])}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        selectedTargetClasses.includes('SEMUA')
                          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>🌐 Semua Kelas (Umum)</span>
                      {selectedTargetClasses.includes('SEMUA') && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Tombol Pintas Pilih Seluruh Tingkatan */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Pintas Tingkatan (Pilih Sekaligus Kelas Paralel):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(classesByTingkat).map((tKey) => {
                        const rombels = classesByTingkat[tKey] || [];
                        const rombelNames = rombels.map((c) => c.name);
                        const isAllSelected = !selectedTargetClasses.includes('SEMUA') && rombelNames.every((r) => selectedTargetClasses.includes(r));
                        const isSomeSelected = !selectedTargetClasses.includes('SEMUA') && rombelNames.some((r) => selectedTargetClasses.includes(r));

                        return (
                          <button
                            key={tKey}
                            type="button"
                            onClick={() => handleToggleAllInTingkat(tKey)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                              isAllSelected
                                ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                                : isSomeSelected
                                ? 'bg-indigo-100 border-indigo-300 text-indigo-900'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Pilih Seluruh {tKey} ({rombels.map((c) => c.code).join(' & ')})</span>
                            {isAllSelected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grid Checkbox Rombel Berdasarkan Tingkatan */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {Object.keys(classesByTingkat).map((tKey) => {
                      const rombels = classesByTingkat[tKey] || [];
                      const isTingkatFullySelected =
                        !selectedTargetClasses.includes('SEMUA') &&
                        rombels.every((r) => selectedTargetClasses.includes(r.name));

                      return (
                        <div
                          key={tKey}
                          className={`p-3 rounded-xl border transition-all ${
                            isTingkatFullySelected
                              ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-400/40'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/80">
                            <span className="font-extrabold text-xs text-slate-800">
                              {tKey}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleAllInTingkat(tKey)}
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                            >
                              {isTingkatFullySelected ? 'Batalkan' : 'Pilih Semua'}
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {rombels.map((cls) => {
                              const isChecked =
                                !selectedTargetClasses.includes('SEMUA') &&
                                selectedTargetClasses.includes(cls.name);

                              return (
                                <label
                                  key={cls.id}
                                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                                    isChecked
                                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-2xs'
                                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleTargetClass(cls.name)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                  />
                                  <div className="flex items-center justify-between flex-1">
                                    <span>{cls.name}</span>
                                    <span className="text-[10px] font-mono text-slate-400 font-normal">
                                      {cls.code}
                                    </span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Target Summary Indicator */}
                  <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    selectedTargetClasses.includes('SEMUA')
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  }`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold flex items-center gap-1.5">
                        {selectedTargetClasses.includes('SEMUA') ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>Target: Semua Kelas (Umum untuk seluruh 6 Rombel)</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Target Terpilih ({selectedTargetClasses.length} Rombel):</span>
                          </>
                        )}
                      </span>
                      {!selectedTargetClasses.includes('SEMUA') && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTargetClasses.map((cName) => (
                            <span
                              key={cName}
                              className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]"
                            >
                              🏫 {cName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {!selectedTargetClasses.includes('SEMUA') && selectedTargetClasses.length > 1 && (
                      <span className="text-[11px] font-bold text-emerald-700 shrink-0 hidden md:block">
                        ✓ Soal dibagikan ke {selectedTargetClasses.length} kelas sekaligus tanpa perlu duplikasi!
                      </span>
                    )}
                  </div>
                </div>

                {/* Stimulus / Wacana */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Stimulus Wacana / Teks Pengantar (Opsional):
                  </label>
                  <textarea
                    value={stimulus}
                    onChange={(e) => setStimulus(e.target.value)}
                    placeholder="Masukkan wacana bacaan atau ilustrasi teks pendukung soal jika ada..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Pertanyaan */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pertanyaan / Butir Soal * :
                  </label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Tuliskan pertanyaan ujian di sini..."
                    rows={2}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* 1. KHUSUS BENTUK PILIHAN GANDA (PG A - D) */}
                {questionType === 'pg' && (
                  <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-blue-900">
                        Input Opsi Jawaban (A sampai D - Pilih 1 Kunci yang Benar):
                      </span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Standar SMP (4 Opsi: A - D)
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { key: 'A', val: pgOptA, set: setPgOptA },
                        { key: 'B', val: pgOptB, set: setPgOptB },
                        { key: 'C', val: pgOptC, set: setPgOptC },
                        { key: 'D', val: pgOptD, set: setPgOptD }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 cursor-pointer shrink-0 font-bold w-12">
                            <input
                              type="radio"
                              name="pgCorrectRadio"
                              checked={pgCorrectKey === item.key}
                              onChange={() => setPgCorrectKey(item.key)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>{item.key}.</span>
                          </label>
                          <input
                            type="text"
                            value={item.val}
                            onChange={(e) => item.set(e.target.value)}
                            placeholder={`Teks pilihan jawaban ${item.key}`}
                            required
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-blue-700 font-bold pt-1">
                      * Kunci Jawaban Benar yang Aktif: Opsi {pgCorrectKey}
                    </div>
                  </div>
                )}

                {/* 2. KHUSUS BENTUK PG KOMPLEKS (PGK A - D: 2 ATAU 3 KUNCI BENAR) */}
                {questionType === 'pgk' && (
                  <div className="space-y-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-indigo-900">
                        Input Opsi A - D & Centang 2 atau 3 Kunci Jawaban yang Benar:
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        pgkCorrectKeys.length >= 2 && pgkCorrectKeys.length <= 3
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {pgkCorrectKeys.length} Kunci Dipilih (Wajib 2 atau 3)
                      </span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { key: 'A', val: pgkOptA, set: setPgkOptA },
                        { key: 'B', val: pgkOptB, set: setPgkOptB },
                        { key: 'C', val: pgkOptC, set: setPgkOptC },
                        { key: 'D', val: pgkOptD, set: setPgkOptD }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 cursor-pointer shrink-0 font-bold w-12">
                            <input
                              type="checkbox"
                              checked={pgkCorrectKeys.includes(item.key)}
                              onChange={() => handleTogglePgkKey(item.key)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span>{item.key}.</span>
                          </label>
                          <input
                            type="text"
                            value={item.val}
                            onChange={(e) => item.set(e.target.value)}
                            placeholder={`Teks pilihan PGK ${item.key}`}
                            required
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-indigo-800 font-bold pt-1">
                      * Kunci Tercentang Saat Ini: [{pgkCorrectKeys.join(', ') || 'Belum ada'}]
                    </div>
                  </div>
                )}

                {/* 3. KHUSUS BENTUK BENAR / SALAH (B/S) */}
                {questionType === 'bs' && (
                  <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900">
                        Input Baris Pernyataan & Kunci Kebenarannya:
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setStatements([
                            ...statements,
                            { id: `s_${Date.now()}`, text: '', correctAnswer: 'B' }
                          ])
                        }
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                      >
                        + Tambah Baris Pernyataan
                      </button>
                    </div>

                    <div className="space-y-2">
                      {statements.map((stmt, idx) => (
                        <div key={stmt.id} className="flex items-center gap-2">
                          <span className="font-bold text-slate-500 w-5">{idx + 1}.</span>
                          <input
                            type="text"
                            value={stmt.text}
                            onChange={(e) => {
                              const updated = [...statements];
                              updated[idx].text = e.target.value;
                              setStatements(updated);
                            }}
                            placeholder="Tuliskan pernyataan evaluasi..."
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                          />
                          <div className="flex items-center gap-2 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            <label className="flex items-center gap-1 cursor-pointer font-bold text-emerald-700">
                              <input
                                type="radio"
                                name={`bs_${stmt.id}`}
                                checked={stmt.correctAnswer === 'B'}
                                onChange={() => {
                                  const updated = [...statements];
                                  updated[idx].correctAnswer = 'B';
                                  setStatements(updated);
                                }}
                              />
                              <span>Benar</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer font-bold text-rose-700">
                              <input
                                type="radio"
                                name={`bs_${stmt.id}`}
                                checked={stmt.correctAnswer === 'S'}
                                onChange={() => {
                                  const updated = [...statements];
                                  updated[idx].correctAnswer = 'S';
                                  setStatements(updated);
                                }}
                              />
                              <span>Salah</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. KHUSUS BENTUK MENJODOHKAN (MATCHING) */}
                {questionType === 'menjodohkan' && (
                  <div className="space-y-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-950">
                        Input Pasangan Kolom Kiri ➔ Kolom Kanan:
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setMatchingPairs([
                            ...matchingPairs,
                            { id: `m_${Date.now()}`, leftText: '', rightText: '' }
                          ])
                        }
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px]"
                      >
                        + Tambah Baris Pasangan
                      </button>
                    </div>

                    <div className="space-y-2">
                      {matchingPairs.map((pair, idx) => (
                        <div key={pair.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <div className="sm:col-span-5 flex items-center gap-1.5">
                            <span className="font-bold text-slate-500 w-4">{idx + 1}.</span>
                            <input
                              type="text"
                              value={pair.leftText}
                              onChange={(e) => {
                                const updated = [...matchingPairs];
                                updated[idx].leftText = e.target.value;
                                setMatchingPairs(updated);
                              }}
                              placeholder="Kolom Kiri (Premis/Istilah)"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                          <span className="text-center font-bold text-slate-400 sm:col-span-1">➔</span>
                          <div className="sm:col-span-6">
                            <input
                              type="text"
                              value={pair.rightText}
                              onChange={(e) => {
                                const updated = [...matchingPairs];
                                updated[idx].rightText = e.target.value;
                                setMatchingPairs(updated);
                              }}
                              placeholder="Kolom Kanan (Pasangan Jawaban Benar)"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-emerald-800"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pembahasan Solusi */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pembahasan / Solusi Soal:
                  </label>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Tuliskan kunci pembahasan ilmiah untuk bahan review siswa..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  {editingQuestion && (
                    <button
                      type="button"
                      onClick={handleCancelEditQuestion}
                      className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`flex-1 py-3 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                      editingQuestion
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white'
                    }`}
                  >
                    {editingQuestion ? <Pencil className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{editingQuestion ? 'Simpan Perubahan Soal' : 'Simpan & Masukkan Soal ke Ujian CBT'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: BANK SOAL CBT PAI & BP */}
          {activeTab === 'bankSoal' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Bank Soal PAI & BP ({questions.length} Butir Soal)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mata Pelajaran Pendidikan Agama Islam & Budi Pekerti (SMP: Opsi A - D)
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {onClearAllQuestions && questions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDialog({
                          title: 'Hapus Seluruh Bank Soal',
                          message: 'Apakah Anda yakin ingin menghapus SEMUA butir soal dalam bank soal? Peserta tidak akan mendapatkan soal ujian jika bank soal kosong.',
                          confirmLabel: 'Ya, Hapus Semua Soal',
                          cancelLabel: 'Batal',
                          isDestructive: true,
                          onConfirm: () => {
                            onClearAllQuestions();
                            setConfirmDialog(null);
                            showToast('Seluruh butir soal berhasil dihapus', 'info');
                          }
                        });
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Semua Soal</span>
                    </button>
                  )}
                  {onRestoreDefaultQuestions && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDialog({
                          title: 'Muat Ulang Bank Soal',
                          message: 'Muat ulang bank soal default Pendidikan Agama Islam & Budi Pekerti (12 soal kurikulum resmi)?',
                          confirmLabel: 'Ya, Muat Ulang Soal',
                          cancelLabel: 'Batal',
                          isDestructive: false,
                          onConfirm: () => {
                            onRestoreDefaultQuestions();
                            setConfirmDialog(null);
                            showToast('Bank soal default PAI & BP berhasil dimuat ulang', 'success');
                          }
                        });
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Muat Ulang Soal PAI</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Bentuk Soal & Filter Kelas */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 font-semibold">Tipe:</span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700"
                    >
                      <option value="all">Semua Bentuk ({questions.length})</option>
                      <option value="pg">Pilihan Ganda (PG A-D)</option>
                      <option value="pgk">PG Kompleks (PGK A-D)</option>
                      <option value="bs">Benar / Salah (B/S)</option>
                      <option value="menjodohkan">Menjodohkan</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 font-semibold">Target Kelas:</span>
                    <select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-blue-700"
                    >
                      <option value="all">Semua Soal ({questions.length})</option>
                      <option value="SEMUA">🌐 Umum / Semua Kelas</option>
                      <optgroup label="Pintas Filter Per Tingkatan">
                        {Object.keys(classesByTingkat).map((tKey) => (
                          <option key={tKey} value={`tingkat:${tKey}`}>
                            ⚡ Seluruh {tKey} ({classesByTingkat[tKey].map(c => c.code).join(' & ')})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Filter Per Rombel Spesifik">
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.name}>
                            🏫 {cls.name} ({cls.tingkat})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Menampilkan <strong>{filteredQuestions.length}</strong> dari <strong>{questions.length}</strong> butir soal
                </div>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Tidak ada butir soal yang sesuai filter atau bank soal kosong</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Anda dapat membuat soal baru di tab "Buat Soal" atau klik "Muat Ulang Soal PAI" untuk mengembalikan soal contoh.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto p-1">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold flex items-center justify-center text-[11px]">
                            {q.number}
                          </span>
                          <span className="font-bold text-slate-800">{q.subtest}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.type === 'pg'
                              ? 'bg-blue-100 text-blue-800'
                              : q.type === 'pgk'
                              ? 'bg-indigo-100 text-indigo-800'
                              : q.type === 'bs'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {q.type === 'pg'
                              ? 'Pilihan Ganda (A-D)'
                              : q.type === 'pgk'
                              ? 'PG Kompleks (A-D)'
                              : q.type === 'bs'
                              ? 'Benar / Salah'
                              : 'Menjodohkan'}
                          </span>

                          {/* Badge Target Kelas / Multi-Rombel */}
                          {!q.targetClass || q.targetClass === 'SEMUA' || (q.targetClasses && q.targetClasses.includes('SEMUA')) ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              🌐 Semua Kelas (Umum)
                            </span>
                          ) : q.targetClasses && q.targetClasses.length > 0 ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                                <School className="w-3 h-3 text-indigo-600" />
                                <span>Target ({q.targetClasses.length} Rombel): {q.targetClasses.join(', ')}</span>
                              </span>
                              {q.targetClasses.length > 1 && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Paralel Bersama
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              🏫 {q.targetClass}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setQuestionModalToEdit(q)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                            title="Edit Soal & Skor"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit Soal</span>
                          </button>
                          {onDeleteQuestion && (
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  title: 'Hapus Butir Soal',
                                  message: `Apakah Anda yakin ingin menghapus butir soal nomor ${q.number} (${q.subtest} - ${q.type.toUpperCase()}) dari bank soal?`,
                                  confirmLabel: 'Ya, Hapus Soal',
                                  cancelLabel: 'Batal',
                                  isDestructive: true,
                                  onConfirm: () => {
                                    onDeleteQuestion(q.id);
                                    setConfirmDialog(null);
                                    showToast(`Butir soal nomor #${q.number} berhasil dihapus`, 'success');
                                  }
                                });
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                              title="Hapus Butir Soal"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="font-semibold text-slate-900 line-clamp-2">
                        {q.questionText}
                      </p>

                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span>Tingkat: <strong>{q.difficulty}</strong></span>
                          <span>•</span>
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                            {q.points} Poin
                          </span>
                        </div>
                        <span className="text-emerald-700 font-bold">
                          Kunci: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer.length > 25 ? 'Pasangan Valid' : q.correctAnswer}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: REKAPITULASI & DOWNLOAD NILAI SISWA */}
          {activeTab === 'rekapNilai' && (
            <div className="space-y-5">
              {/* Top Banner & Action Buttons */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
                      Laporan Hasil Asesmen CBT PAI & BP
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      ● {filteredExamResults.length} Siswa Terdata
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Sinkronisasi Cloud Real-Time</span>
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mt-1">
                    Daftar Rekapitulasi Nilai Siswa
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                    Data pengerjaan siswa dari HP langsung terupdate secara otomatis dan real-time ke tabel rekap ini melalui Firebase Cloud.
                  </p>
                </div>

                {/* Download and Print Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadGradesCsv}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
                    title="Download Data Nilai ke Format Excel (CSV)"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-950" />
                    <span>Download Excel / CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                    title="Cetak Rekap Nilai Siswa"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>Cetak (PDF)</span>
                  </button>

                  {onLoadSampleResults && examResults.length === 0 && (
                    <button
                      type="button"
                      onClick={onLoadSampleResults}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Muat Nilai Simulasi</span>
                    </button>
                  )}

                  {onClearAllResults && examResults.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDialog({
                          title: 'Hapus Semua Riwayat Nilai',
                          message: 'Apakah Anda yakin ingin menghapus seluruh riwayat rekap nilai siswa yang tersimpan? Tindakan ini tidak dapat dibatalkan.',
                          confirmLabel: 'Ya, Hapus Semua Nilai',
                          cancelLabel: 'Batal',
                          isDestructive: true,
                          onConfirm: () => {
                            onClearAllResults();
                            setConfirmDialog(null);
                            showToast('Seluruh riwayat nilai siswa berhasil dihapus', 'info');
                          }
                        });
                      }}
                      className="p-2.5 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                      title="Hapus Semua Riwayat Nilai"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* KPI Summary Statistics */}
              {examStats.total > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold block">Rata-Rata Nilai</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-black text-emerald-700">{examStats.avgPercent}%</span>
                      <span className="text-xs font-bold text-slate-600">({examStats.avgScale} CBT)</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Skor rata-rata kelas</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold block">Kelulusan (KKM 65%)</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-2xl font-black text-emerald-600">{examStats.passedCount}</span>
                      <span className="text-xs text-slate-500">dari {examStats.total} siswa</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {Math.round((examStats.passedCount / examStats.total) * 100)}% Tuntas
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold block">Perlu Remedial</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-2xl font-black ${examStats.failedCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {examStats.failedCount}
                      </span>
                      <span className="text-xs text-slate-500">siswa</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Nilai di bawah 65%</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-semibold block">Nilai Tertinggi / Terendah</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-black text-blue-700">{examStats.highest}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-lg font-bold text-slate-600">{examStats.lowest}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Rentang Skala Nilai CBT</span>
                  </div>
                </div>
              )}

              {/* Filter Kelas & Search Siswa */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-700">Filter Kelas:</span>
                  <select
                    value={filterNilaiKelas}
                    onChange={(e) => setFilterNilaiKelas(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="SEMUA">🌐 Semua Kelas ({examResults.length} Siswa)</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        🏫 {cls.name} ({cls.tingkat})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchNilaiQuery}
                    onChange={(e) => setSearchNilaiQuery(e.target.value)}
                    placeholder="Cari nama atau no peserta..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Table of Results */}
              {filteredExamResults.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                  <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h5 className="font-bold text-sm text-slate-800">Belum Ada Data Nilai Siswa</h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Data nilai siswa akan otomatis tercatat setiap kali siswa menyelesaikan ujian CBT. Anda juga dapat memuat data simulasi untuk mencoba fitur download laporan nilai.
                  </p>
                  {onLoadSampleResults && (
                    <button
                      type="button"
                      onClick={onLoadSampleResults}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition inline-flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Muat Contoh Rekap Nilai Siswa</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                  <table className="w-full border-collapse bg-white text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3 w-10 text-center">No</th>
                        <th className="py-3 px-4">Nama Siswa / No. Peserta</th>
                        <th className="py-3 px-3">Kelas</th>
                        <th className="py-3 px-3 text-center">Jawaban (B/S/K)</th>
                        <th className="py-3 px-3 text-center">Poin / Skor</th>
                        <th className="py-3 px-3 text-center">Skor CBT</th>
                        <th className="py-3 px-3 text-center">Nilai (%)</th>
                        <th className="py-3 px-3 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {filteredExamResults.map((res, idx) => {
                        const maxPts = res.maxPoints || 100;
                        return (
                          <tr key={`${res.student.noPeserta}-${res.startTime}`} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-3 text-center font-bold text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={res.student.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                                  alt={res.student.nama}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block">{res.student.nama}</span>
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                                    <span className="text-blue-700 font-semibold">{res.student.noPeserta}</span>
                                    <span>•</span>
                                    <span>NISN: {res.student.nisn}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-800 block">{res.student.kelas}</span>
                              <span className="text-[10px] text-slate-500">{res.student.ruang}</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1 text-[11px] font-mono">
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200" title="Benar">
                                  {res.correctCount}B
                                </span>
                                <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200" title="Salah">
                                  {res.wrongCount}S
                                </span>
                                {res.unansweredCount > 0 && (
                                  <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200" title="Kosong">
                                    {res.unansweredCount}K
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                {res.rawScore} / {maxPts}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="font-mono font-black text-sm text-slate-900">
                                {res.scaleScore}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`font-extrabold text-sm ${res.isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {res.percentage}%
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold inline-block ${
                                res.isPassed
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}>
                                {res.isPassed ? '✓ TUNTAS' : '✕ REMEDIAL'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {onViewExamResultDetail && (
                                  <button
                                    type="button"
                                    onClick={() => onViewExamResultDetail(res)}
                                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 text-[11px] transition cursor-pointer"
                                    title="Lihat Sertifikat & Pembahasan"
                                  >
                                    Lihat Hasil
                                  </button>
                                )}
                                {onDeleteExamResult && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConfirmDialog({
                                        title: 'Hapus Nilai Siswa',
                                        message: `Apakah Anda yakin ingin menghapus catatan nilai ujian siswa ${res.student.nama} (${res.student.noPeserta})?`,
                                        confirmLabel: 'Ya, Hapus Nilai',
                                        cancelLabel: 'Batal',
                                        isDestructive: true,
                                        onConfirm: () => {
                                          onDeleteExamResult(res.student.noPeserta, res.startTime);
                                          setConfirmDialog(null);
                                          showToast(`Nilai siswa "${res.student.nama}" berhasil dihapus`, 'info');
                                        }
                                      });
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
                                    title="Hapus Nilai Siswa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TOKEN & SESI */}
          {activeTab === 'token' && (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    Token Ujian Aktif Saat Ini:
                  </span>
                  <div className="text-3xl font-mono font-black text-amber-950 tracking-widest mt-1">
                    {tokenState.token}
                  </div>
                  <span className="text-[11px] text-amber-700 mt-1 block">
                    Siswa wajib menginput token ini pada saat verifikasi ujian.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateRandomToken}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Rilis Token Baru</span>
                </button>
              </div>

              {/* Form Custom Token */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customToken.trim()) {
                    onUpdateToken(customToken.trim().toUpperCase());
                    setTokenCopied(true);
                    setTimeout(() => setTokenCopied(false), 2000);
                  }
                }}
                className="space-y-3"
              >
                <label className="block text-xs font-bold text-slate-700">
                  Ubah / Kustomisasi Kode Token Pengawas:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value.toUpperCase())}
                    maxLength={10}
                    placeholder="Contoh: CBT2026"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {tokenCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Key className="w-4 h-4" />}
                    <span>{tokenCopied ? 'Tersimpan!' : 'Simpan Token'}</span>
                  </button>
                </div>
              </form>

              {/* Reset Session Option */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Reset Sesi & Jawaban Simulasi</span>
                    <span className="text-[11px] text-slate-500">
                      Hapus riwayat jawaban terakhir agar siswa dapat mencoba kembali dari awal.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDialog({
                        title: 'Reset Sesi Ujian',
                        message: 'Apakah Anda yakin ingin mereset seluruh data simulasi ujian dan sesi login? Jawaban terakhir akan dibersihkan.',
                        confirmLabel: 'Ya, Reset Sesi',
                        cancelLabel: 'Batal',
                        isDestructive: true,
                        onConfirm: () => {
                          onResetExamData();
                          setConfirmDialog(null);
                          showToast('Data sesi simulasi berhasil direset', 'success');
                        }
                      });
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Tutup Panel Guru
          </button>
        </div>

        {/* Sub-Modal: In-App Confirmation Dialog */}
        {confirmDialog && (
          <ConfirmDialogModal
            config={confirmDialog}
            onClose={() => setConfirmDialog(null)}
          />
        )}

        {/* Sub-Modal: Edit Data Siswa Langsung */}
        {studentModalToEdit && (
          <EditStudentDialogModal
            student={studentModalToEdit}
            classes={classes}
            onClose={() => setStudentModalToEdit(null)}
            onSave={(updated) => {
              if (onUpdateStudent) {
                onUpdateStudent(updated);
              }
              setStudentModalToEdit(null);
              showToast(`Data siswa "${updated.nama}" berhasil diperbarui`, 'success');
            }}
          />
        )}

        {/* Sub-Modal: Edit Butir Soal Langsung */}
        {questionModalToEdit && (
          <EditQuestionDialogModal
            question={questionModalToEdit}
            classes={classes}
            onClose={() => setQuestionModalToEdit(null)}
            onSave={(updated) => {
              if (onUpdateQuestion) {
                onUpdateQuestion(updated);
              }
              setQuestionModalToEdit(null);
              showToast(`Butir soal nomor #${updated.number} berhasil diperbarui`, 'success');
            }}
          />
        )}

        {/* In-App Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-[80] animate-in fade-in slide-in-from-top-4 duration-200">
            <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 max-w-sm ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-950/20'
                : toastMessage.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-950/20'
                : 'bg-slate-900 text-white border-slate-700 shadow-black/20'
            }`}>
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />}
              {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0 text-rose-200" />}
              {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
