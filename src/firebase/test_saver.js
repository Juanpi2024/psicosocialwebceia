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

const testData = [
    {
        studentId: "20.123.456-7",
        studentName: "Camila Soto",
        curso: "3° Y 4° MEDIO HC",
        testId: "chaea",
        scores: { ACTIVO: 18, REFLEXIVO: 12, TEORICO: 10, PRAGMATICO: 14 },
        profile: "Activo",
        answers: [],
    },
    {
        studentId: "21.987.654-3",
        studentName: "Diego Morales",
        curso: "1° Y 2° MEDIO ELECTRICO",
        testId: "socioemocional",
        scores: { GestionEmocional: 1.5, PercepcionAprendizaje: 2.0, InteraccionSocial: 1.8 },
        profile: "Requiere Apoyo",
        answers: [
            { id: 3, value: 1 }, // No puede calmarse
            { id: 4, value: 1 }  // No piensa antes de actuar
        ],
    },
    {
        studentId: "19.333.222-1",
        studentName: "Sofía Valenzuela",
        curso: "3° MEDIO PÁRVULO",
        testId: "motivacion",
        scores: { Intrinsica: 4.5, Extrinsica: 3.0, Amotivacion: 1.2 },
        profile: "Motivación Intrínseca",
        answers: [],
    }
];

async function saveTestData() {
    console.log("Iniciando guardado de 3 alumnos ficticios...");
    try {
        for (const data of testData) {
            const docRef = await addDoc(collection(db, "testResults"), {
                ...data,
                timestamp: serverTimestamp()
            });
            console.log(`✅ Resultado guardado para ${data.studentName} con ID: ${docRef.id}`);
        }
        console.log("🎉 Pruebas completadas exitosamente.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al guardar datos de prueba:", error);
        process.exit(1);
    }
}

saveTestData();
