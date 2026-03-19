import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

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

// Función para poner un límite de tiempo a las peticiones de Firebase
const withTimeout = (promise, ms = 3000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase Timeout')), ms))
  ]);
};

export const saveTestResult = async (resultData) => {
  try {
    const docRef = await addDoc(collection(db, 'testResults'), {
      ...resultData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving result:', error);
    return `mock-id-${Math.random()}`;
  }
};

export const getDCSEJSituations = async () => {
  return mockDCSEJSituations;
};

export const getTestResults = async () => {
  try {
    const q = query(collection(db, 'testResults'), orderBy('timestamp', 'desc'));
    // Si Firebase no responde en 3 segundos, saltamos a los datos de prueba
    const querySnapshot = await withTimeout(getDocs(q), 3000);

    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));

    return results.length > 0 ? results : mockResults;
  } catch (error) {
    if (error.message === 'Firebase Timeout' || error.name === 'AbortError') {
      console.warn('⚠️ Firebase lento o abortado. Activando Modo Maqueta.');
    } else {
      console.error('Error inesperado en Firebase:', error);
    }
    return mockResults;
  }
};
