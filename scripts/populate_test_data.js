import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, serverTimestamp } from "firebase/firestore";

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

const students = [
    { id: "15.123.456-7", nombre: "Camila Pérez", curso: "3° Medio B" },
    { id: "18.987.654-2", nombre: "Rodrigo Soto", curso: "4° Medio A" },
    { id: "21.555.333-k", nombre: "Elena Méndez", curso: "2° Medio C" }
];

async function populate() {
    console.log("Iniciando inserción de datos de prueba...");

    for (const student of students) {
        console.log(`Generando datos para ${student.nombre}...`);

        // 1. CHAEA
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "chaea",
            scores: { ACTIVO: 15, REFLEXIVO: 12, TEORICO: 8, PRAGMATICO: 10 },
            profile: "ACTIVO",
            answers: Array.from({ length: 80 }, (_, i) => ({ id: i + 1, value: Math.random() > 0.5 })),
            completedAt: serverTimestamp()
        });

        // 2. Socioemocional (DIA)
        const isCritical = student.nombre === "Rodrigo Soto";
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "socioemocional",
            scores: { 
                Intrapersonal: isCritical ? 12 : 20, 
                Interpersonal: isCritical ? 10 : 18, 
                Ciudadana: isCritical ? 8 : 16, 
                Gestion: isCritical ? 10 : 15,
                Total: isCritical ? 40 : 69
            },
            profile: isCritical ? "Requiere Apoyo" : "Adecuado",
            answers: Array.from({ length: 22 }, (_, i) => ({ 
                id: i + 1, 
                value: isCritical && (i === 3 || i === 6 || i === 10) ? 1 : (isCritical ? 2 : 4),
                dimension: i < 6 ? "Intrapersonal" : i < 10 ? "Interpersonal" : i < 17 ? "Ciudadana" : "Gestion"
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
                "Amotivación": student.nombre === "Rodrigo Soto" ? 28 : 4,
                "Regulación Externa": 15,
                "Regulación Introyectada": 20,
                "Regulación Identificada": 22,
                "MI Conocimiento": 25,
                "MI Logro": 24,
                "MI Experiencias": 18
            },
            profile: "Completado",
            answers: Array.from({ length: 28 }, (_, i) => ({ id: i + 1, value: 4 })),
            completedAt: serverTimestamp()
        });

        // 4. Autoeficacia (EAPESA)
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "autoeficacia",
            scores: { total: student.nombre === "Camila Pérez" ? 48 : 30 },
            profile: "Completado",
            answers: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, value: 3 })),
            completedAt: serverTimestamp()
        });

        // 5. Clima (EPCSE)
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "clima",
            scores: { total: 35 },
            profile: "Completado",
            answers: [],
            completedAt: serverTimestamp()
        });

        // 6. Test Situacional (DCSE-J)
        const isHigh = student.nombre === "Camila Pérez";
        await addDoc(collection(db, "resultados"), {
            studentId: student.id,
            studentName: student.nombre,
            curso: student.curso,
            testId: "dcsej",
            scores: { total: isHigh ? 15 : 9 },
            profile: isHigh ? "Habilidades Sociales Altas" : "Requiere Entrenamiento",
            answers: [],
            completedAt: serverTimestamp()
        });
    }

    console.log("¡Inserción de datos finalizada!");
    process.exit(0);
}

populate().catch(err => {
    console.error("Error populating data:", err);
    process.exit(1);
});
