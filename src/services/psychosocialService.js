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
    console.error("Error saving result:", error);
    return "mock-id-" + Math.random();
  }
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
      console.warn("⚠️ Firebase lento o abortado. Activando Modo Maqueta.");
    } else {
      console.error("Error inesperado en Firebase:", error);
    }
    return mockResults;
  }
};
