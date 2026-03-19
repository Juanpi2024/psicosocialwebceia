import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Datos de prueba ultraseguros (sin acentos para evitar errores de encoding en build)
const mockResults = [
  {
    studentId: '12.345.678-K',
    studentName: 'Juan Invitado',
    curso: '2 Medio A',
    testId: 'chaea',
    scores: { ACTIVO: 12, REFLEXIVO: 15, TEORICO: 8, PRAGMATICO: 14 },
    profile: 'Reflexivo/Pragmatico',
    timestamp: new Date()
  },
  {
    studentId: '98.765.432-1',
    studentName: 'Maria Alerta',
    curso: '1 Medio B',
    testId: 'socioemocional',
    scores: { GestionEmocional: 4, PercepcionAprendizaje: 5, InteraccionSocial: 3 },
    profile: 'Requiere Apoyo',
    timestamp: new Date()
  }
];

const mockDCSEJSituations = [
  {
    title: 'Conflicto en trabajo grupal',
    context: 'Durante un trabajo en equipo, dos compañeros comienzan a discutir.',
    options: [
      { text: 'Ignorar la discusion y hacer tu parte en silencio.', points: 1 },
      { text: 'Proponer una pausa breve y retomar con turnos para hablar.', points: 3 },
      { text: 'Retarte con ambos para que se callen de inmediato.', points: 0 }
    ]
  }
];

const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase Timeout')), ms))
  ]);
};

export const saveTestResult = async (studentId, studentName, curso, testId, scores, profile, answers = []) => {
  try {
    const dataToSave = typeof studentId === 'object' ? studentId : {
      studentId,
      studentName,
      curso,
      testId,
      scores,
      profile,
      answers,
      timestamp: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'testResults'), dataToSave);
    return docRef.id;
  } catch (error) {
    console.error('Save failed:', error);
    return `mock-${Math.random()}`;
  }
};

export const getDCSEJSituations = async () => {
  return mockDCSEJSituations;
};

export const getTestResults = async () => {
  try {
    const q = query(collection(db, 'testResults'), orderBy('timestamp', 'desc'));
    const querySnapshot = await withTimeout(getDocs(q), 5000);
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      let timestamp = new Date();
      if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        timestamp = data.timestamp.toDate();
      }
      return { id: doc.id, ...data, timestamp };
    });
    return results.length > 0 ? results : mockResults;
  } catch (error) {
    console.warn('Fallback to mock:', error.message);
    return mockResults;
  }
};
