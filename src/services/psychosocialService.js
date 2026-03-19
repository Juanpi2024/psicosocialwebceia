import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

const LOCAL_RESULTS_KEY = 'psicosocial_test_results_cache';

// Datos de prueba blindados para la presentación
const mockResults = [
  {
    studentId: '12.345.678-K',
    studentName: 'Juan Invitado',
    curso: '2 Medio A',
    testId: 'chaea',
    scores: { ACTIVO: 12, REFLEXIVO: 15, TEORICO: 8, PRAGMATICO: 14 },
    profile: 'Reflexivo/Pragmatico',
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

// Utilidades para Cache Local
const getLocalResults = () => {
  try {
    const raw = localStorage.getItem(LOCAL_RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const setLocalResults = (results) => {
  try {
    localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(results.slice(0, 50))); // Guardamos los ultimos 50
  } catch (e) { console.warn("Cache local llena", e); }
};

export const saveTestResult = async (studentId, studentName, curso, testId, scores, profile, answers = []) => {
  // 1. Normalizar los datos (Soporta objeto unico o argumentos separados)
  const resultData = typeof studentId === 'object' ? studentId : {
    studentId,
    studentName,
    curso,
    testId,
    scores,
    profile,
    answers,
    timestamp: new Date().toISOString()
  };

  const fallbackId = `local-${Date.now()}`;
  
  // 2. Guardado preventivo en cache local
  const currentLocal = getLocalResults();
  setLocalResults([{ ...resultData, id: fallbackId }, ...currentLocal]);

  try {
    // 3. Intentar guardado en Firebase
    const docRef = await addDoc(collection(db, 'testResults'), {
      ...resultData,
      timestamp: serverTimestamp()
    });
    
    // 4. Actualizar ID en cache local si tuvo exito
    const updatedLocal = getLocalResults().map(r => r.id === fallbackId ? { ...r, id: docRef.id } : r);
    setLocalResults(updatedLocal);
    
    return docRef.id;
  } catch (error) {
    console.error('Error enviando a Firebase (queda en cache local):', error);
    return fallbackId;
  }
};

export const getDCSEJSituations = async () => mockDCSEJSituations;

export const getTestResults = async () => {
  const localCache = getLocalResults();
  
  try {
    const q = query(collection(db, 'testResults'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const cloudResults = querySnapshot.docs.map(doc => {
      const data = doc.data();
      let timestamp = new Date();
      if (data.timestamp?.toDate) timestamp = data.timestamp.toDate();
      return { id: doc.id, ...data, timestamp };
    });

    if (cloudResults.length > 0) {
      setLocalResults(cloudResults);
      return cloudResults;
    }
    return localCache.length > 0 ? localCache : mockResults;
  } catch (error) {
    console.warn('Usando cache local por fallo de red:', error.message);
    return localCache.length > 0 ? localCache : mockResults;
  }
};
