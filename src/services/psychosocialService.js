import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Datos de apoyo (solo se muestran si la base de datos esta REALMENTE vacia)
const fallbackMock = [
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
    context: 'Durante un trabajo en equipo, dos compañeros comienzan a discutir.',
    options: [
      { text: 'Ignorar la discusion y hacer tu parte en silencio.', points: 1 },
      { text: 'Proponer una pausa breve y retomar con turnos para hablar.', points: 3 },
      { text: 'Retarte con ambos para que se callen de inmediato.', points: 0 }
    ]
  }
];

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
    console.error('Error al guardar:', error);
    return null;
  }
};

export const getDCSEJSituations = async () => mockDCSEJSituations;

export const getTestResults = async () => {
  try {
    // Intentamos obtener los datos sin limite de tiempo estricto primero
    const q = query(collection(db, 'testResults'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      let timestamp = new Date();
      if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        timestamp = data.timestamp.toDate();
      }
      return { id: doc.id, ...data, timestamp };
    });

    console.log(`Firebase OK: ${results.length} registros cargados.`);
    // SOLO si la coleccion esta vacia devolvemos la maqueta
    return results.length > 0 ? results : fallbackMock;
  } catch (error) {
    console.error('Fallo critico en Firebase, usando respaldo:', error);
    return fallbackMock;
  }
};
