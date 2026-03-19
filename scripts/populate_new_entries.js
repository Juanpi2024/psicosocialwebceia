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

const newStudents = [
    { id: "16.444.888-9", nombre: "Juan Carlos Valenzuela", curso: "4° Medio Eléctrico" },
    { id: "17.222.111-3", nombre: "Marcelo Torres", curso: "4° Medio Eléctrico" }
];

async function populate() {
    console.log("Iniciando inserción de nuevos alumnos (4° Medio Eléctrico)...");

    for (const student of newStudents) {
        console.log(`Generando datos para ${student.nombre}...`);
        const isMarcelo = student.nombre === "Marcelo Torres";

        // 1. CHAEA
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "chaea",
            scores: isMarcelo ? { ACTIVO: 5, REFLEXIVO: 10, TEORICO: 18, PRAGMATICO: 7 } : { ACTIVO: 10, REFLEXIVO: 8, TEORICO: 10, PRAGMATICO: 16 },
            profile: isMarcelo ? "TEORICO" : "PRAGMATICO",
            answers: Array.from({ length: 80 }, (_, i) => ({ id: i + 1, value: true })),
            completedAt: serverTimestamp()
        });

        // 2. Socioemocional (DIA)
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "socioemocional",
            scores: isMarcelo ? { Total: 42 } : { Total: 75 },
            profile: isMarcelo ? "Requiere Apoyo" : "Adecuado",
            answers: Array.from({ length: 22 }, (_, i) => ({ 
                id: i + 1, 
                value: isMarcelo && (i === 11 || i === 12 || i === 13) ? 1 : (isMarcelo ? 2 : 4), // Alerta en ciudadanía/respeto para Marcelo
                dimension: "General" 
            })),
            completedAt: serverTimestamp()
        });

        // 3. Motivación (EME-S)
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "motivacion",
            scores: {
                "Amotivación": isMarcelo ? 10 : 4,
                "Regulación Externa": 20,
                "Regulación Introyectada": 15,
                "Regulación Identificada": isMarcelo ? 12 : 25,
                "MI Conocimiento": isMarcelo ? 14 : 28,
                "MI Logro": 20,
                "MI Experiencias": 18
            },
            profile: "Completado",
            answers: [],
            completedAt: serverTimestamp()
        });

        // 4. Autoeficacia (EAPESA)
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "autoeficacia",
            scores: { total: isMarcelo ? 22 : 44 },
            profile: "Completado",
            answers: [],
            completedAt: serverTimestamp()
        });

        // 5. Clima (EPCSE)
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "clima",
            scores: { total: isMarcelo ? 15 : 36 },
            profile: "Completado",
            answers: [],
            completedAt: serverTimestamp()
        });

        // 6. Test Situacional (DCSE-J)
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "dcsej",
            scores: { total: isMarcelo ? 6 : 16 },
            profile: isMarcelo ? "Requiere Entrenamiento" : "Habilidades Sociales Altas",
            answers: [],
            completedAt: serverTimestamp()
        });
    }

    console.log("¡Inserción de nuevos ingresos finalizada!");
    process.exit(0);
}

populate().catch(err => {
    console.error("Error populating data:", err);
    process.exit(1);
});
