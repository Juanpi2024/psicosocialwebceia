import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

const LOCAL_RESULTS_KEY = 'psicosocial_test_results_cache';

// Datos vacíos - la base de datos real alimenta el sistema
const mockResults = [];

const parseDate = (value) => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }
  return new Date();
};

const getLocalResults = () => {
  try {
    const raw = localStorage.getItem(LOCAL_RESULTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      timestamp: parseDate(item.timestamp)
    }));
  } catch {
    return [];
  }
};

const setLocalResults = (results) => {
  try {
    localStorage.setItem(
      LOCAL_RESULTS_KEY,
      JSON.stringify(
        results.map((item) => ({
          ...item,
          timestamp: parseDate(item.timestamp).toISOString()
        }))
      )
    );
  } catch (error) {
    console.warn('No se pudo persistir cache local de resultados:', error);
  }
};

const persistLocalResult = (result) => {
  const current = getLocalResults();
  const next = [result, ...current.filter((item) => item.id !== result.id)];
  setLocalResults(next);
  return next;
};

const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase Timeout')), ms))
  ]);
};

// saveTestResult adaptada para recibir los 7 argumentos actuales 
// o un objeto segun tu nuevo parche.
export const saveTestResult = async (studentId, studentName, curso, testId, scores, profile, answers = []) => {
  
  // Normalizamos a objeto unico sea cual sea el origen
  const resultData = typeof studentId === 'object' ? studentId : {
     studentId, studentName, curso, testId, scores, profile, answers
  };

  const fallbackId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const localDraft = {
    ...resultData,
    id: fallbackId,
    timestamp: new Date()
  };

  persistLocalResult(localDraft);

  try {
    const docRef = await addDoc(collection(db, 'testResults'), {
      ...resultData,
      timestamp: serverTimestamp()
    });

    persistLocalResult({
      ...localDraft,
      id: docRef.id
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving result (usando cache local):', error);
    return fallbackId;
  }
};



export const getTestResults = async () => {
  const localResults = getLocalResults();

  try {
    const q = query(collection(db, 'testResults'), orderBy('timestamp', 'desc'));
    const querySnapshot = await withTimeout(getDocs(q), 5000);

    const cloudResults = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let timestamp = new Date();
      if (data.timestamp?.toDate) timestamp = data.timestamp.toDate();
      return { id: doc.id, ...data, timestamp };
    });

    if (cloudResults.length > 0) {
      setLocalResults(cloudResults);
      return cloudResults;
    }

    if (localResults.length > 0) return localResults;
    return mockResults;
  } catch (error) {
    console.warn('Usando cache local por lentitud/error:', error.message);
    if (localResults.length > 0) return localResults;
    return mockResults;
  }
};
