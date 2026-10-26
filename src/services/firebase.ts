/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ExamResult, Student, ExamTokenState, ClassRombel, Question } from '../types/cbt';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = initializeFirestore(
  app,
  {
    experimentalAutoDetectLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.warn('Firestore Warning/Error: ', JSON.stringify(errInfo));
}

// Connection status tracking
type ConnectionCallback = (status: {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  error: string | null;
}) => void;

const connectionListeners: Set<ConnectionCallback> = new Set();
let currentConnectionState = {
  isConnected: true,
  isSyncing: false,
  lastSyncTime: Date.now(),
  error: null as string | null
};

function notifyConnectionListeners() {
  connectionListeners.forEach((cb) => {
    try {
      cb({ ...currentConnectionState });
    } catch (e) {
      console.warn('Error in connection listener:', e);
    }
  });
}

function updateConnectionSuccess() {
  currentConnectionState = {
    isConnected: true,
    isSyncing: false,
    lastSyncTime: Date.now(),
    error: null
  };
  notifyConnectionListeners();
}

function updateConnectionError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  currentConnectionState = {
    isConnected: false,
    isSyncing: false,
    lastSyncTime: currentConnectionState.lastSyncTime,
    error: msg
  };
  notifyConnectionListeners();
}

export function subscribeToConnectionStatus(callback: ConnectionCallback): () => void {
  connectionListeners.add(callback);
  callback({ ...currentConnectionState });
  return () => {
    connectionListeners.delete(callback);
  };
}

export async function testCloudConnection(): Promise<boolean> {
  try {
    currentConnectionState.isSyncing = true;
    notifyConnectionListeners();
    const testDoc = await getDoc(doc(db, TOKEN_COLL, TOKEN_DOC));
    updateConnectionSuccess();
    return testDoc.exists();
  } catch (e) {
    updateConnectionError(e);
    return false;
  }
}

// ============================================================================
// 1. EXAM RESULTS SYNC (Hasil Ujian Siswa dari HP -> Laptop Guru Realtime)
// ============================================================================
const EXAM_RESULTS_COLL = 'exam_results';

export async function saveExamResultToCloud(result: ExamResult): Promise<void> {
  const cleanPeserta = (result.student.noPeserta || 'siswa').replace(/[^a-zA-Z0-9_-]/g, '_');
  const docId = `${cleanPeserta}_${result.startTime || Date.now()}`;
  const path = `${EXAM_RESULTS_COLL}/${docId}`;
  try {
    const payload = {
      id: docId,
      examId: result.examId || 'pai-bp-2026',
      examTitle: result.examTitle || 'Asesmen Sumatif CBT PAI & BP',
      noPeserta: result.student.noPeserta,
      nama: result.student.nama,
      kelas: result.student.kelas,
      student: {
        id: result.student.id || cleanPeserta,
        noPeserta: result.student.noPeserta,
        nama: result.student.nama,
        kelas: result.student.kelas,
        nisn: result.student.nisn || '',
        sekolah: result.student.sekolah || 'SMP',
        ruang: result.student.ruang || '01',
        sesi: result.student.sesi || 'Sesi 1',
        fotoUrl: result.student.fotoUrl || ''
      },
      startTime: result.startTime,
      endTime: result.endTime,
      durationSecondsUsed: result.durationSecondsUsed,
      totalQuestions: result.totalQuestions,
      correctCount: result.correctCount,
      wrongCount: result.wrongCount,
      unansweredCount: result.unansweredCount,
      doubtfulCount: result.doubtfulCount || 0,
      rawScore: result.rawScore,
      scaleScore: result.scaleScore,
      percentage: result.percentage,
      scale100: Math.round(result.percentage),
      isPassed: result.isPassed,
      subtestScores: result.subtestScores || [],
      submittedAt: new Date(result.endTime || Date.now()).toISOString()
    };
    await setDoc(doc(db, EXAM_RESULTS_COLL, docId), payload);
    updateConnectionSuccess();
  } catch (error) {
    updateConnectionError(error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export function subscribeToExamResults(
  callback: (results: ExamResult[]) => void
): () => void {
  const path = EXAM_RESULTS_COLL;
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      updateConnectionSuccess();
      const results: ExamResult[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.noPeserta && data.nama) {
          results.push({
            examId: data.examId || 'pai-bp-2026',
            examTitle: data.examTitle || 'Asesmen PAI & BP',
            student: data.student || {
              id: data.noPeserta,
              noPeserta: data.noPeserta,
              nama: data.nama,
              kelas: data.kelas || 'Kelas VII-A',
              nisn: '',
              sekolah: 'SMP',
              ruang: '01',
              sesi: 'Sesi 1',
              fotoUrl: data.fotoUrl || ''
            },
            startTime: data.startTime || Date.now(),
            endTime: data.endTime || Date.now(),
            durationSecondsUsed: data.durationSecondsUsed || 0,
            totalQuestions: data.totalQuestions || 15,
            correctCount: data.correctCount || 0,
            wrongCount: data.wrongCount || 0,
            unansweredCount: data.unansweredCount || 0,
            doubtfulCount: data.doubtfulCount || 0,
            rawScore: data.rawScore || 0,
            scaleScore: data.scaleScore || 500,
            percentage: data.percentage || 0,
            isPassed: data.isPassed ?? false,
            subtestScores: data.subtestScores || [],
            answers: {}
          });
        }
      });
      // Newest first
      results.sort((a, b) => b.endTime - a.endTime);
      callback(results);
    },
    (error) => {
      updateConnectionError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function deleteExamResultFromCloud(result: ExamResult): Promise<void> {
  const cleanPeserta = (result.student.noPeserta || 'siswa').replace(/[^a-zA-Z0-9_-]/g, '_');
  const docId = `${cleanPeserta}_${result.startTime}`;
  const path = `${EXAM_RESULTS_COLL}/${docId}`;
  try {
    await deleteDoc(doc(db, EXAM_RESULTS_COLL, docId));
    updateConnectionSuccess();
  } catch (error) {
    updateConnectionError(error);
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export async function clearAllExamResultsFromCloud(): Promise<void> {
  const path = EXAM_RESULTS_COLL;
  try {
    const snap = await getDocs(collection(db, path));
    const batch = writeBatch(db);
    snap.forEach((d) => {
      batch.delete(d.ref);
    });
    await batch.commit();
    updateConnectionSuccess();
  } catch (error) {
    updateConnectionError(error);
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// ============================================================================
// 2. TOKEN UJIAN SYNC (Guru Ubah Token -> Semua HP Siswa Terupdate)
// ============================================================================
const TOKEN_DOC = 'current';
const TOKEN_COLL = 'exam_token';

export async function saveTokenToCloud(tokenState: ExamTokenState): Promise<void> {
  const path = `${TOKEN_COLL}/${TOKEN_DOC}`;
  try {
    await setDoc(doc(db, TOKEN_COLL, TOKEN_DOC), {
      token: tokenState.token.toUpperCase(),
      generatedAt: tokenState.generatedAt || Date.now(),
      expiresInMinutes: tokenState.expiresInMinutes || 120
    });
    updateConnectionSuccess();
  } catch (error) {
    updateConnectionError(error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export function subscribeToToken(
  callback: (tokenState: ExamTokenState) => void
): () => void {
  const path = `${TOKEN_COLL}/${TOKEN_DOC}`;
  return onSnapshot(
    doc(db, TOKEN_COLL, TOKEN_DOC),
    (docSnap) => {
      updateConnectionSuccess();
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (d && d.token) {
          callback({
            token: d.token,
            generatedAt: d.generatedAt || Date.now(),
            expiresInMinutes: d.expiresInMinutes || 120
          });
        }
      }
    },
    (error) => {
      updateConnectionError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// ============================================================================
// 3. KELAS & STATUS AKTIVASI SYNC (Aktivasi 6 Rombel Guru -> HP Siswa)
// ============================================================================
const CLASSES_DOC = 'active_rombel';
const CLASSES_COLL = 'classes';

export async function saveClassesToCloud(classes: ClassRombel[]): Promise<void> {
  const path = `${CLASSES_COLL}/${CLASSES_DOC}`;
  try {
    await setDoc(doc(db, CLASSES_COLL, CLASSES_DOC), {
      list: classes,
      updatedAt: Date.now()
    });
    updateConnectionSuccess();
  } catch (error) {
    updateConnectionError(error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export function subscribeToClasses(
  callback: (classes: ClassRombel[]) => void
): () => void {
  const path = `${CLASSES_COLL}/${CLASSES_DOC}`;
  return onSnapshot(
    doc(db, CLASSES_COLL, CLASSES_DOC),
    (docSnap) => {
      updateConnectionSuccess();
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.list)) {
          callback(data.list);
        }
      }
    },
    (error) => {
      updateConnectionError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// ============================================================================
// 4. DATA SISWA SYNC (Guru Tambah/Edit Siswa -> HP Siswa Bisa Login)
// ============================================================================
const STUDENTS_DOC = 'all_students';
const STUDENTS_COLL = 'students';

export async function saveStudentsToCloud(students: Student[]): Promise<void> {
  const path = `${STUDENTS_COLL}/${STUDENTS_DOC}`;
  try {
    await setDoc(doc(db, STUDENTS_COLL, STUDENTS_DOC), {
      list: students,
      updatedAt: Date.now()
    });
    updateConnectionSuccess();
  } catch (error) {
    updateConnectionError(error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export function subscribeToStudents(
  callback: (students: Student[]) => void
): () => void {
  const path = `${STUDENTS_COLL}/${STUDENTS_DOC}`;
  return onSnapshot(
    doc(db, STUDENTS_COLL, STUDENTS_DOC),
    (docSnap) => {
      updateConnectionSuccess();
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.list)) {
          callback(data.list);
        }
      }
    },
    (error) => {
      updateConnectionError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// ============================================================================
// 5. BANK SOAL SYNC (Guru Tambah/Edit Soal -> HP Siswa Menerima Soal Baru)
// ============================================================================
const QUESTIONS_DOC = 'bank_soal';
const QUESTIONS_COLL = 'questions';

export async function saveQuestionsToCloud(questions: Question[]): Promise<void> {
  const path = `${QUESTIONS_COLL}/${QUESTIONS_DOC}`;
  try {
    await setDoc(doc(db, QUESTIONS_COLL, QUESTIONS_DOC), {
      list: questions,
      updatedAt: Date.now()
    });
    updateConnectionSuccess();
  } catch (error) {
    updateConnectionError(error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export function subscribeToQuestions(
  callback: (questions: Question[]) => void
): () => void {
  const path = `${QUESTIONS_COLL}/${QUESTIONS_DOC}`;
  return onSnapshot(
    doc(db, QUESTIONS_COLL, QUESTIONS_DOC),
    (docSnap) => {
      updateConnectionSuccess();
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.list)) {
          callback(data.list);
        }
      }
    },
    (error) => {
      updateConnectionError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// ============================================================================
// 6. SYNC ALL CURRENT TEACHER LAPTOP DATA TO CLOUD (Force Push Guru -> Siswa)
// ============================================================================
export async function pushAllDataToCloud(
  classes: ClassRombel[],
  students: Student[],
  questions: Question[],
  tokenState: ExamTokenState
): Promise<{ success: boolean; message: string }> {
  try {
    currentConnectionState.isSyncing = true;
    notifyConnectionListeners();

    await Promise.all([
      saveClassesToCloud(classes),
      saveStudentsToCloud(students),
      saveQuestionsToCloud(questions),
      saveTokenToCloud(tokenState)
    ]);

    updateConnectionSuccess();
    return {
      success: true,
      message: 'Seluruh data rombel, siswa, bank soal, dan token berhasil disinkronkan ke Cloud Firebase!'
    };
  } catch (err) {
    updateConnectionError(err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Gagal menyinkronkan data ke cloud.'
    };
  }
}

// ============================================================================
// 7. SEED CLOUD DEFAULTS IF BLANK (Inisialisasi Database Pertama Kali)
// ============================================================================
export async function seedCloudDefaultsIfEmpty(
  defaultClasses: ClassRombel[],
  defaultStudents: Student[],
  defaultQuestions: Question[],
  defaultToken: ExamTokenState
): Promise<void> {
  try {
    const classesDoc = await getDoc(doc(db, CLASSES_COLL, CLASSES_DOC));
    if (!classesDoc.exists()) {
      await saveClassesToCloud(defaultClasses);
    }

    const studentsDoc = await getDoc(doc(db, STUDENTS_COLL, STUDENTS_DOC));
    if (!studentsDoc.exists()) {
      await saveStudentsToCloud(defaultStudents);
    }

    const questionsDoc = await getDoc(doc(db, QUESTIONS_COLL, QUESTIONS_DOC));
    if (!questionsDoc.exists()) {
      await saveQuestionsToCloud(defaultQuestions);
    }

    const tokenDoc = await getDoc(doc(db, TOKEN_COLL, TOKEN_DOC));
    if (!tokenDoc.exists()) {
      await saveTokenToCloud(defaultToken);
    }
    updateConnectionSuccess();
  } catch (err) {
    console.warn('Seed cloud error:', err);
    updateConnectionError(err);
  }
}


