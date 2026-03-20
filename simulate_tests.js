import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCDC9z6BWEo1qgzheTq6rqHWFyVb0-9tAg",
    authDomain: "app-psicosocial-ceia.firebaseapp.com",
    projectId: "app-psicosocial-ceia",
    storageBucket: "app-psicosocial-ceia.firebasestorage.app",
    messagingSenderId: "825541972866",
    appId: "1:825541972866:web:a9776c022db1e63901759b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const full6Tests = [
  { testId: "chaea", scores: { ACTIVO: 14, REFLEXIVO: 12, TEORICO: 16, PRAGMATICO: 10 }, profile: "Teórico" },
  { testId: "socioemocional", scores: { GestionEmocional: 4, PercepcionAprendizaje: 5, Resiliencia: 4 }, profile: "Medio-Alto" },
  { testId: "motivacion", scores: { Intrinsica: 4.0, Extrinsica: 4.2, Amotivacion: 1.5 }, profile: "Motivación Extrínseca" },
  { testId: "autoeficacia", scores: { Confianza: 4.5, Desempeño: 3.8 }, profile: "Alta Autoeficacia" },
  { testId: "clima", scores: { Seguridad: 4.2, Convivencia: 4.5, Pertenencia: 4.7 }, profile: "Clima Positivo" },
  { testId: "dcsej", scores: { Decisiones: "Comunicación Positiva" }, profile: "Liderazgo Colaborativo" }
];

const partial4Tests = [
  { testId: "chaea", scores: { ACTIVO: 8, REFLEXIVO: 15, TEORICO: 10, PRAGMATICO: 14 }, profile: "Reflexivo/Pragmático" },
  { testId: "socioemocional", scores: { GestionEmocional: 3, PercepcionAprendizaje: 3, Resiliencia: 2 }, profile: "Necesita Apoyo" },
  { testId: "motivacion", scores: { Intrinsica: 2.5, Extrinsica: 3.0, Amotivacion: 4.0 }, profile: "Riesgo de Deserción" },
  { testId: "clima", scores: { Seguridad: 2.8, Convivencia: 2.5, Pertenencia: 2.2 }, profile: "Clima Vulnerable" }
];

const COURSES = [
    '7° Y 8° BASICO',
    '1° Y 2° MEDIO HC',
    '3° Y 4° MEDIO HC',
    '1° Y 2° MEDIO ELECTRICO',
    '3° MEDIO ELECTRICO',
    '4° MEDIO ELECTRICO',
    '1° Y 2° MEDIO PÁRVULO',
    '3° MEDIO PÁRVULO',
    '4° MEDIO PÁRVULO'
];

const studentNames = [
    "Pedro Ramos", "Lucía Méndez", "Marcos Silva", "Ana Belén", "Jorge Valdés",
    "Camila Soto", "Valentina Paz", "Diego Torres", "Antonia Vidal"
];

async function simulate() {
  console.log("🚀 Iniciando cobertura total de 9 cursos x 3+ encuestas...");

  for (let i = 0; i < COURSES.length; i++) {
    const curso = COURSES[i];
    const studentName = studentNames[i];
    const studentId = `20.${100 + i}.000-${i}`; // RUT ficticio único

    console.log(`Simulando a ${studentName} (${curso})...`);

    // Cada alumno tendrá al menos 3 encuestas (mezcla de full y partial)
    // Tomamos las primeras 3 de full6Tests
    const selectedTests = full6Tests.slice(0, 3);
    if (i % 2 === 0) selectedTests.push(full6Tests[3]); // Algunos tendrán 4

    for (const t of selectedTests) {
      await addDoc(collection(db, "testResults"), {
        studentId,
        studentName,
        curso,
        ...t,
        timestamp: serverTimestamp(),
        answers: []
      });
    }
  }

  console.log("✨ Simulación masiva finalizada. 9 alumnos creados con éxito.");
  process.exit(0);
}

simulate();
