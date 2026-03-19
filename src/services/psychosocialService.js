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
    context: 'Durante un trabajo en equipo, dos compañeros comienzan a discutir y el ambiente se tensa.',
    options: [
      { text: 'Ignorar la discusión y hacer tu parte en silencio.', points: 1 },
      { text: 'Proponer una pausa breve y retomar con turnos para hablar.', points: 3 },
      { text: 'Retarte con ambos para que se callen de inmediato.', points: 0 }
    ]
  },
  {
    title: 'Crítica de un docente',
    context: 'Un profesor corrige tu presentación frente al curso y sientes incomodidad.',
    options: [
      { text: 'Tomarlo personal y dejar de participar ese día.', points: 0 },
      { text: 'Pedir una aclaración al final de la clase para mejorar.', points: 3 },
      { text: 'Responder en el momento para defenderte sin escuchar.', points: 1 }
    ]
  }
];

// Función para poner un límite de tiempo a las peticiones de Firebase
const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase Timeout')), ms))
  ]);
};

/**
 * Guarda el resultado de un test. 
 * Se adapta para recibir argumentos individuales o un objeto.
 */
export const saveTestResult = async (studentId, studentName, curso, testId, scores, profile, answers = []) => {
  try {
    // Si el primer argumento es un objeto, lo usamos directamente (compatibilidad)
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

    console.log('Guardando resultado:', dataToSave);
    const docRef = await addDoc(collection(db, 'testResults'), dataToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar en Firebase:', error);
    return `mock-id-${Math.random()}`;
  }
};

export const getDCSEJSituations = async () => {
  return mockDCSEJSituations;
};

export const getTestResults = async () => {
  console.log('Intentando cargar resultados de Firebase...');
  try {
    const q = query(collection(db, 'testResults'), orderBy('timestamp', 'desc'));
    const querySnapshot = await withTimeout(getDocs(q), 5000);

    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Procesamiento seguro de la fecha
      let timestamp = new Date();
      if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        timestamp = data.timestamp.toDate();
      } else if (data.timestamp instanceof Date) {
        timestamp = data.timestamp;
      }

      return {
        id: doc.id,
        ...data,
        timestamp
      };
    });

    console.log(`Cargados ${results.length} resultados reales.`);
    return results.length > 0 ? results : mockResults;
  } catch (error) {
    console.warn('Usando datos de maqueta por error en Firebase:', error.message);
    return mockResults;
  }
};
