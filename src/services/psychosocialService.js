import { db } from '../firebase/config';
import { collection, getDocs, doc, setDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

/**
 * Obtiene todas las preguntas del Test VAK ordenadas.
 */
export const getVAKQuestions = async () => {
    try {
        const q = query(collection(db, 'preguntas_vak'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        const questions = [];
        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });
        return questions;
    } catch (error) {
        console.error("Error obteniendo preguntas VAK:", error);
        throw error;
    }
};

/**
 * Obtiene todas las historias del Test DCSE-J ordenadas.
 */
export const getDCSEJSituations = async () => {
    try {
        const q = query(collection(db, 'situaciones_dcsej'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        const situations = [];
        querySnapshot.forEach((doc) => {
            situations.push({ id: doc.id, ...doc.data() });
        });
        return situations;
    } catch (error) {
        console.error("Error obteniendo historias DCSE-J:", error);
        throw error;
    }
};

/**
 * Guarda el resultado final de un test en Firebase.
 * @param {string} studentId - ID o RUT del estudiante.
 * @param {string} studentName - Nombre del estudiante.
 * @param {string} testId - 'vak' o 'dcse_j'.
 * @param {object} scores - Objeto con los puntajes obtenidos.
 * @param {string} profile - Perfil dominante (VAK) o Nivel (DCSE-J).
 * @param {array} answers - Historial de respuestas seleccionadas por el alumno.
 */
export const saveTestResult = async (studentId, studentName, testId, scores, profile, answers) => {
    try {
        // Generar un ID único para este resultado, por ejemplo: R12345678-vak-1678234321
        const uniqueId = `${studentId}-${testId}-${Date.now()}`;
        const resultRef = doc(db, 'resultados', uniqueId);

        await setDoc(resultRef, {
            studentId,
            studentName,
            testId,
            scores,
            profile,
            answers,
            completedAt: serverTimestamp()
        });

        return uniqueId;
    } catch (error) {
        console.error("Error guardando el resultado del test:", error);
        throw error;
    }
};
