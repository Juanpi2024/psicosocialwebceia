import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Datos de prueba para que la maqueta nunca se vea vacía en Vercel
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
  },
  {
      studentId: '12.345.678-K',
      studentName: 'Juan Invitado',
      curso: '2° Medio A',
      testId: 'socioemocional',
      scores: { GestionEmocional: 14, PercepcionAprendizaje: 15, InteraccionSocial: 13 },
      profile: 'Óptimo',
      timestamp: new Date()
  }
];

export const saveTestResult = async (resultData) => {
  try {
    const docRef = await addDoc(collection(db, 'testResults'), {
      ...resultData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving result:", error);
    // En maqueta, simulamos éxito para no romper el flujo
    return "mock-id-" + Math.random();
  }
};

export const getTestResults = async () => {
  try {
    const q = query(collection(db, 'testResults'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
    
    // Si no hay datos (o hay error de conexión), devolvemos los mock para la presentación
    return results.length > 0 ? results : mockResults;
  } catch (error) {
    console.error("Error fetching results, using mock data:", error);
    return mockResults;
  }
};
