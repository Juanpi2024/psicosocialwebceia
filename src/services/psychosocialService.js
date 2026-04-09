import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

const LOCAL_RESULTS_KEY = 'psicosocial_test_results_cache';

// Datos de prueba blindados para la presentación
const mockResults = [
  {
    studentId: '12.345.678-K',
    studentName: 'Juan Invitado',
    curso: '2° Medio A',
    testId: 'chaea',
    scores: { ACTIVO: 12, REFLEXIVO: 15, TEORICO: 8, PRAGMATICO: 14 },
    profile: 'Reflexivo/Pragmático',
    timestamp: new Date()
  },
  {
    studentId: '98.765.432-1',
    studentName: 'Maria Alerta',
    curso: '1° Medio B',
    testId: 'socioemocional',
    scores: { GestionEmocional: 4, PercepcionAprendizaje: 5, InteraccionSocial: 3 },
    profile: 'Requiere Apoyo',
    timestamp: new Date()
  }
];

const mockDCSEJSituations = [
  {
    title: 'Conflicto en trabajo grupal',
    context: 'Durante un trabajo en equipo, dos compañeros comienzan a discutir y el ambiente se tensa. Tú también debes participar para terminar a tiempo.',
    options: [
      { text: 'Ignorar la discusión y hacer tu parte en silencio.', points: 1 },
      { text: 'Proponer una pausa breve y retomar con turnos para hablar.', points: 3 },
      { text: 'Retarte con ambos para que se callen de inmediato.', points: 0 }
    ]
  },
  {
    title: 'Crítica de un docente',
    context: 'Un profesor corrige tu presentación frente al curso y sientes incomodidad. Aún quedan actividades por realizar.',
    options: [
      { text: 'Tomarlo personal y dejar de participar ese día.', points: 0 },
      { text: 'Pedir una aclaración al final de la clase para mejorar.', points: 3 },
      { text: 'Responder en el momento para defenderte sin escuchar.', points: 1 }
    ]
  },
  {
    title: 'Compañero con señales de desánimo',
    context: 'Notas que un compañero que antes participaba activamente ahora está aislado y evita hablar en clases.',
    options: [
      { text: 'No intervenir porque no es tu responsabilidad.', points: 1 },
      { text: 'Conversar con él/ella y sugerir apoyo del equipo docente.', points: 3 },
      { text: 'Comentar su situación con otros compañeros en recreo.', points: 0 }
    ]
  },
  {
    title: 'Presión antes de evaluación',
    context: 'Horas antes de una prueba importante, sientes mucha ansiedad y te cuesta concentrarte.',
    options: [
      { text: 'Abandonar el estudio porque ya no vale la pena.', points: 0 },
      { text: 'Aplicar respiración breve y organizar un plan de repaso.', points: 3 },
      { text: 'Copiar un resumen sin revisar si te sirve.', points: 1 }
    ]
  }
];

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

export const getDCSEJSituations = async () => {
  return mockDCSEJSituations;
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
