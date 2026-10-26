/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TkaExamView } from './components/TkaExamView';
import { ExamResultView } from './components/ExamResultView';
import { SupervisorModal } from './components/SupervisorModal';
import { ShareExamModal } from './components/ShareExamModal';
import { 
  saveExamResultToCloud, 
  subscribeToExamResults, 
  deleteExamResultFromCloud, 
  clearAllExamResultsFromCloud,
  saveTokenToCloud,
  subscribeToToken,
  saveClassesToCloud,
  subscribeToClasses,
  saveStudentsToCloud,
  subscribeToStudents,
  saveQuestionsToCloud,
  subscribeToQuestions,
  seedCloudDefaultsIfEmpty
} from './services/firebase';
import { 
  Student, 
  Question, 
  ExamResult, 
  ExamTokenState,
  ClassRombel,
  isQuestionAssignedToClass
} from './types/cbt';
import { 
  MOCK_QUESTIONS, 
  MOCK_STUDENTS, 
  DEFAULT_EXAM_TOKEN, 
  MOCK_EXAM_INFO,
  DEFAULT_6_ROMBEL,
  INITIAL_STUDENT_RESULTS
} from './data/mockQuestions';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'exam' | 'result'>('dashboard');
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [prefilledStudent, setPrefilledStudent] = useState<Student | null>(null);

  // Load 6 Rombel classes from localStorage or fallback
  const [classes, setClasses] = useState<ClassRombel[]>(() => {
    try {
      const saved = localStorage.getItem('cbt_tka_rombel');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].examTitle?.includes('TKA')) {
          return DEFAULT_6_ROMBEL;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_6_ROMBEL;
  });

  // Load students from localStorage or fallback to MOCK_STUDENTS
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('cbt_tka_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If old format student participants without PAI prefix, migrate to PAI mock students
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].noPeserta?.includes('PAI')) {
          return MOCK_STUDENTS;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return MOCK_STUDENTS;
  });

  // Load questions from localStorage or fallback to MOCK_QUESTIONS
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('cbt_tka_questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If old questions (like Penalaran Matematika) or having 5 options, migrate to PAI & BP questions!
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          (parsed[0].subtest === 'Penalaran Matematika' ||
           parsed.some((q: Question) => q.options?.some((opt) => opt.key === 'E')))
        ) {
          return MOCK_QUESTIONS;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return MOCK_QUESTIONS;
  });

  // Load token from localStorage or fallback
  const [tokenState, setTokenState] = useState<ExamTokenState>(() => {
    try {
      const saved = localStorage.getItem('cbt_tka_token');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.token === 'TKA2026') {
          return {
            token: DEFAULT_EXAM_TOKEN,
            generatedAt: Date.now(),
            expiresInMinutes: 120
          };
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return {
      token: DEFAULT_EXAM_TOKEN,
      generatedAt: Date.now(),
      expiresInMinutes: 120
    };
  });

  // Load last exam result
  const [lastResult, setLastResult] = useState<ExamResult | null>(() => {
    try {
      const saved = localStorage.getItem('cbt_tka_last_result');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Load all exam results for student grades report
  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    try {
      const saved = localStorage.getItem('cbt_pai_results');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENT_RESULTS;
  });

  const [isSupervisorOpen, setIsSupervisorOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [supervisorInitialTab, setSupervisorInitialTab] = useState<
    'aktivasiKelas' | 'siswa' | 'tambahSoal' | 'bankSoal' | 'token' | 'rekapNilai'
  >('aktivasiKelas');

  // 1. Initial Cloud Seeding (Jika database di cloud masih baru/kosong)
  useEffect(() => {
    seedCloudDefaultsIfEmpty(DEFAULT_6_ROMBEL, MOCK_STUDENTS, MOCK_QUESTIONS, {
      token: DEFAULT_EXAM_TOKEN,
      generatedAt: Date.now(),
      expiresInMinutes: 120
    });
  }, []);

  // 2. Real-time listener: Sync student exam results from Firebase Cloud
  useEffect(() => {
    try {
      const unsubscribe = subscribeToExamResults((cloudResults) => {
        if (cloudResults && cloudResults.length > 0) {
          setExamResults(cloudResults);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase exam results subscription fallback to local:', e);
    }
  }, []);

  // 3. Real-time listener: Sync active token from Firebase Cloud
  useEffect(() => {
    try {
      const unsubscribe = subscribeToToken((cloudToken) => {
        if (cloudToken && cloudToken.token) {
          setTokenState(cloudToken);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase token subscription fallback to local:', e);
    }
  }, []);

  // 4. Real-time listener: Sync classes (6 Rombel & status aktivasi) from Firebase Cloud
  useEffect(() => {
    try {
      const unsubscribe = subscribeToClasses((cloudClasses) => {
        if (cloudClasses && cloudClasses.length > 0) {
          setClasses(cloudClasses);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase classes subscription fallback to local:', e);
    }
  }, []);

  // 5. Real-time listener: Sync students from Firebase Cloud
  useEffect(() => {
    try {
      const unsubscribe = subscribeToStudents((cloudStudents) => {
        if (cloudStudents && cloudStudents.length > 0) {
          setStudents(cloudStudents);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase students subscription fallback to local:', e);
    }
  }, []);

  // 6. Real-time listener: Sync questions from Firebase Cloud
  useEffect(() => {
    try {
      const unsubscribe = subscribeToQuestions((cloudQuestions) => {
        if (cloudQuestions && cloudQuestions.length > 0) {
          setQuestions(cloudQuestions);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase questions subscription fallback to local:', e);
    }
  }, []);

  // Sync classes to localStorage as local fallback
  useEffect(() => {
    try {
      localStorage.setItem('cbt_tka_rombel', JSON.stringify(classes));
    } catch (e) {}
  }, [classes]);

  // Sync students to localStorage as local fallback
  useEffect(() => {
    try {
      localStorage.setItem('cbt_tka_students', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  // Sync questions to localStorage as local fallback
  useEffect(() => {
    try {
      localStorage.setItem('cbt_tka_questions', JSON.stringify(questions));
    } catch (e) {}
  }, [questions]);

  // Sync token to localStorage as local fallback
  useEffect(() => {
    try {
      localStorage.setItem('cbt_tka_token', JSON.stringify(tokenState));
    } catch (e) {}
  }, [tokenState]);

  // Sync last result
  useEffect(() => {
    try {
      if (lastResult) {
        localStorage.setItem('cbt_tka_last_result', JSON.stringify(lastResult));
      }
    } catch (e) {}
  }, [lastResult]);

  // Sync exam results history
  useEffect(() => {
    try {
      localStorage.setItem('cbt_pai_results', JSON.stringify(examResults));
    } catch (e) {}
  }, [examResults]);

  // Handler: start exam
  const handleStartExam = (student: Student, _enteredToken: string) => {
    setActiveStudent(student);
    setCurrentView('exam');
  };

  // Handler: finish exam (Save to local and sync to Firebase Cloud)
  const handleFinishExam = (result: ExamResult) => {
    setLastResult(result);
    setExamResults((prev) => [
      result,
      ...prev.filter(
        (r) => !(r.student.noPeserta === result.student.noPeserta && r.startTime === result.startTime)
      )
    ]);
    // Save to Firebase Cloud so teacher immediately receives it on laptop
    saveExamResultToCloud(result).catch((err) => {
      console.warn('Could not sync exam result to cloud:', err);
    });
    setCurrentView('result');
  };

  // Handler: back to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Handler: retake exam
  const handleRetakeExam = () => {
    if (!activeStudent) {
      setActiveStudent(students[0] || MOCK_STUDENTS[0]);
    }
    setCurrentView('exam');
  };

  // Handler: update token (Sync to Firebase Cloud so all student devices get it)
  const handleUpdateToken = (newToken: string) => {
    const updatedState: ExamTokenState = {
      token: newToken.toUpperCase(),
      generatedAt: Date.now(),
      expiresInMinutes: 120
    };
    setTokenState(updatedState);
    saveTokenToCloud(updatedState).catch((err) => {
      console.warn('Could not sync token to cloud:', err);
    });
  };

  // Handler: add student (Sync to Cloud)
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => {
      const next = [newStudent, ...prev];
      saveStudentsToCloud(next).catch((err) => console.warn(err));
      return next;
    });
  };

  // Handler: update student (Edit Data Siswa - Sync to Cloud)
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
      saveStudentsToCloud(next).catch((err) => console.warn(err));
      return next;
    });
    // Also update prefilled or active student if matching
    if (prefilledStudent?.id === updatedStudent.id) {
      setPrefilledStudent(updatedStudent);
    }
    if (activeStudent?.id === updatedStudent.id) {
      setActiveStudent(updatedStudent);
    }
  };

  // Handler: delete student (Sync to Cloud)
  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== studentId);
      saveStudentsToCloud(next).catch((err) => console.warn(err));
      return next;
    });
  };

  // Handler: select student for login
  const handleSelectStudentForLogin = (student: Student) => {
    setPrefilledStudent(student);
    setCurrentView('dashboard');
  };

  // Handler: add question (Sync to Cloud)
  const handleAddQuestion = (newQ: Question) => {
    setQuestions((prev) => {
      const next = [...prev, newQ];
      saveQuestionsToCloud(next).catch((err) => console.warn(err));
      return next;
    });
  };

  // Handler: update question (Edit Bank Soal - Sync to Cloud)
  const handleUpdateQuestion = (updatedQ: Question) => {
    setQuestions((prev) => {
      const next = prev.map((q) => (q.id === updatedQ.id ? updatedQ : q));
      saveQuestionsToCloud(next).catch((err) => console.warn(err));
      return next;
    });
  };

  // Handler: delete question (Sync to Cloud)
  const handleDeleteQuestion = (questionId: number) => {
    setQuestions((prev) => {
      const next = prev.filter((q) => q.id !== questionId);
      saveQuestionsToCloud(next).catch((err) => console.warn(err));
      return next;
    });
  };

  // Handler: clear all questions (Sync to Cloud)
  const handleClearAllQuestions = () => {
    setQuestions([]);
    saveQuestionsToCloud([]).catch((err) => console.warn(err));
  };

  // Handler: restore default PAI questions (Sync to Cloud)
  const handleRestoreDefaultQuestions = () => {
    setQuestions(MOCK_QUESTIONS);
    saveQuestionsToCloud(MOCK_QUESTIONS).catch((err) => console.warn(err));
  };

  // Handler: delete single student exam result
  const handleDeleteExamResult = (noPeserta: string, startTime: number) => {
    const target = examResults.find(
      (r) => r.student.noPeserta === noPeserta && r.startTime === startTime
    );
    if (target) {
      deleteExamResultFromCloud(target).catch((e) => console.warn(e));
    }
    setExamResults((prev) =>
      prev.filter((r) => !(r.student.noPeserta === noPeserta && r.startTime === startTime))
    );
  };

  // Handler: clear all student exam results
  const handleClearAllResults = () => {
    clearAllExamResultsFromCloud().catch((e) => console.warn(e));
    setExamResults([]);
  };

  // Handler: restore sample student exam results
  const handleLoadSampleResults = () => {
    setExamResults(INITIAL_STUDENT_RESULTS);
  };

  // Handler: clear all students
  const handleClearAllStudents = () => {
    setStudents([]);
    saveStudentsToCloud([]).catch((err) => console.warn(err));
  };

  // Handler: restore default students
  const handleRestoreDefaultStudents = () => {
    setStudents(MOCK_STUDENTS);
    saveStudentsToCloud(MOCK_STUDENTS).catch((err) => console.warn(err));
  };

  // Handler: toggle class activation (Sync to Cloud)
  const handleToggleClassActivation = (classId: string, forceActive?: boolean) => {
    setClasses((prev) => {
      const next = prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              isActive: forceActive !== undefined ? forceActive : !c.isActive,
              activatedAt: !c.isActive ? Date.now() : c.activatedAt
            }
          : c
      );
      saveClassesToCloud(next).catch((err) => console.warn(err));
      return next;
    });
  };

  // Handler: toggle all classes (Sync to Cloud)
  const handleToggleAllClasses = (activateAll: boolean) => {
    setClasses((prev) => {
      const next = prev.map((c) => ({
        ...c,
        isActive: activateAll,
        activatedAt: activateAll ? Date.now() : c.activatedAt
      }));
      saveClassesToCloud(next).catch((err) => console.warn(err));
      return next;
    });
  };

  // Handler: update class token (Sync to Cloud)
  const handleUpdateClassToken = (classId: string, newToken: string) => {
    setClasses((prev) => {
      const next = prev.map((c) =>
        c.id === classId ? { ...c, token: newToken.toUpperCase() } : c
      );
      saveClassesToCloud(next).catch((err) => console.warn(err));
      return next;
    });
  };

  // Handler: reset data
  const handleResetExamData = () => {
    localStorage.removeItem('cbt_tka_last_result');
    localStorage.removeItem('cbt_tka_students');
    localStorage.removeItem('cbt_tka_questions');
    localStorage.removeItem('cbt_tka_rombel');
    setLastResult(null);
    setStudents(MOCK_STUDENTS);
    setQuestions(MOCK_QUESTIONS);
    setClasses(DEFAULT_6_ROMBEL);
    setTokenState({
      token: DEFAULT_EXAM_TOKEN,
      generatedAt: Date.now(),
      expiresInMinutes: 120
    });
    saveClassesToCloud(DEFAULT_6_ROMBEL).catch((err) => console.warn(err));
    saveStudentsToCloud(MOCK_STUDENTS).catch((err) => console.warn(err));
    saveQuestionsToCloud(MOCK_QUESTIONS).catch((err) => console.warn(err));
    saveTokenToCloud({
      token: DEFAULT_EXAM_TOKEN,
      generatedAt: Date.now(),
      expiresInMinutes: 120
    }).catch((err) => console.warn(err));
  };

  // Filter questions for the active student's class (Semua Kelas + Multi Rombel Tingkatan)
  const studentQuestions = React.useMemo(() => {
    if (!activeStudent) return questions;
    const filtered = questions.filter((q) => isQuestionAssignedToClass(q, activeStudent.kelas));
    const finalSet = filtered.length > 0 ? filtered : questions;
    return finalSet.map((q, idx) => ({ ...q, number: idx + 1 }));
  }, [questions, activeStudent]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Institutional Top Navbar */}
      <Navbar
        tokenState={tokenState}
        onOpenSupervisor={() => {
          setSupervisorInitialTab('aktivasiKelas');
          setIsSupervisorOpen(true);
        }}
        onOpenGrades={() => {
          setSupervisorInitialTab('rekapNilai');
          setIsSupervisorOpen(true);
        }}
        onOpenShare={() => setIsShareOpen(true)}
        currentView={currentView}
      />

      {/* View 1: Beranda / Dashboard Siswa & Portal Login */}
      {currentView === 'dashboard' && (
        <DashboardView
          onStartExam={handleStartExam}
          tokenState={tokenState}
          onOpenSupervisorModal={() => {
            setSupervisorInitialTab('aktivasiKelas');
            setIsSupervisorOpen(true);
          }}
          onOpenGradesModal={() => {
            setSupervisorInitialTab('rekapNilai');
            setIsSupervisorOpen(true);
          }}
          onOpenShare={() => setIsShareOpen(true)}
          lastResult={lastResult}
          onViewLastResult={() => setCurrentView('result')}
          students={students}
          prefilledStudent={prefilledStudent}
          classes={classes}
          questions={questions}
          totalExamResults={examResults.length}
        />
      )}

      {/* View 2: Layar Ujian Khas CBT TKA */}
      {currentView === 'exam' && activeStudent && (
        <TkaExamView
          student={activeStudent}
          questions={studentQuestions}
          durationMinutes={MOCK_EXAM_INFO.durationMinutes}
          onFinishExam={handleFinishExam}
          onCancelToDashboard={handleBackToDashboard}
        />
      )}

      {/* View 3: Hasil Ujian, Skor & Pembahasan Kunci Jawaban */}
      {currentView === 'result' && lastResult && (
        <ExamResultView
          result={lastResult}
          questions={studentQuestions}
          onBackToDashboard={handleBackToDashboard}
          onRetakeExam={handleRetakeExam}
        />
      )}

      {/* Modal Bagikan Ujian & QR Code Siswa */}
      <ShareExamModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        tokenState={tokenState}
      />

      {/* Panel Pengawas & Guru CBT */}
      <SupervisorModal
        isOpen={isSupervisorOpen}
        onClose={() => setIsSupervisorOpen(false)}
        initialTab={supervisorInitialTab}
        onTabChange={(tab) => setSupervisorInitialTab(tab)}
        tokenState={tokenState}
        onUpdateToken={handleUpdateToken}
        questions={questions}
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={handleUpdateQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onClearAllQuestions={handleClearAllQuestions}
        onRestoreDefaultQuestions={handleRestoreDefaultQuestions}
        students={students}
        onAddStudent={handleAddStudent}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
        onClearAllStudents={handleClearAllStudents}
        onRestoreDefaultStudents={handleRestoreDefaultStudents}
        onSelectStudentForLogin={handleSelectStudentForLogin}
        onResetExamData={handleResetExamData}
        classes={classes}
        onToggleClassActivation={handleToggleClassActivation}
        onToggleAllClasses={handleToggleAllClasses}
        onUpdateClassToken={handleUpdateClassToken}
        examResults={examResults}
        onDeleteExamResult={handleDeleteExamResult}
        onClearAllResults={handleClearAllResults}
        onLoadSampleResults={handleLoadSampleResults}
        onViewExamResultDetail={(res) => {
          setLastResult(res);
          setIsSupervisorOpen(false);
          setCurrentView('result');
        }}
      />
    </div>
  );
}
