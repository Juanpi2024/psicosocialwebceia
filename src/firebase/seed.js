import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Configuración de la SDK de Cliente para Node.js
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

// Data base inicial
const tests = [
    {
        id: "chaea",
        name: "Test de Estilos de Aprendizaje (CHAEA)",
        description: "Cuestionario de Honey-Alonso para identificar tu estilo de procesamiento de información preferido en un contexto adulto.",
        type: "likert_agreement",
        active: true
    },
    {
        id: "svres",
        name: "Escala de Resiliencia (SV-RES)",
        description: "Cuestionario para evaluar tu capacidad de sobreponerte a la frustración escolar y al estrés.",
        type: "likert_scale",
        active: true
    }
];

// CHAEA simplificado (12 preguntas, 3 de cada estilo)
const preguntasCHAEA = [
    { id: "c1", order: 1, text: "Tengo fama de decir lo que pienso claramente y sin rodeos.", category: "activo" },
    { id: "c2", order: 2, text: "Seguro que las cosas siempre pueden mejorarse si se analizan detenidamente.", category: "reflexivo" },
    { id: "c3", order: 3, text: "Me gusta probar diferentes enfoques hasta ver cuál funciona en la práctica.", category: "pragmatico" },
    { id: "c4", order: 4, text: "Prefiero basarme en teorías y modelos matemáticos o lógicos antes que en intuiciones.", category: "teorico" },
    { id: "c5", order: 5, text: "Suelo actuar con rapidez y seguridad frente a los retos de un trabajo nuevo.", category: "activo" },
    { id: "c6", order: 6, text: "Antes de tomar una decisión, prefiero escuchar las opiniones de todos los involucrados.", category: "reflexivo" },
    { id: "c7", order: 7, text: "Lo más importante de aprender algo es saber cómo aplicarlo a la vida real de inmediato.", category: "pragmatico" },
    { id: "c8", order: 8, text: "Me siento incómodo cuando las cosas no tienen un orden lógico y una planificación estricta.", category: "teorico" },
    { id: "c9", order: 9, text: "Casi siempre me arriesgo a probar cosas nuevas aunque no sepa cómo hacerlas al principio.", category: "activo" },
    { id: "c10", order: 10, text: "Procuro mantener la distancia con los problemas para verlos desde la barrera y con objetividad.", category: "reflexivo" },
    { id: "c11", order: 11, text: "Rechazo las ideas originales de mis compañeros si veo que no se pueden llevar a la práctica.", category: "pragmatico" },
    { id: "c12", order: 12, text: "Me molestan las personas que hacen las cosas 'por ensayo y error' en vez de estudiar el manual.", category: "teorico" },
];

// SV-RES simplificado para el demo (8 preguntas)
const preguntasSVRES = [
    { id: "r1", order: 1, text: "Creo que puedo adaptarme fácilmente cuando las cosas cambian inesperadamente." },
    { id: "r2", order: 2, text: "Tengo al menos una persona cercana a quien puedo acudir si tengo un problema grave." },
    { id: "r3", order: 3, text: "Cuando tengo demasiadas tareas académicas, logro mantener la calma y el enfoque." },
    { id: "r4", order: 4, text: "Suelo visualizar resultados positivos incluso en situaciones frustrantes." },
    { id: "r5", order: 5, text: "Si un profesor me critica constructivamente, lo tomo como una oportunidad en vez de desmotivarme." },
    { id: "r6", order: 6, text: "Me siento seguro/a de mí mismo/a cuando me enfrento a problemas difíciles en mi vida." },
    { id: "r7", order: 7, text: "He logrado superar situaciones dolorosas o estresantes y he salido fortalecido de ellas." },
    { id: "r8", order: 8, text: "Tengo claridad sobre mis metas a futuro y eso me ayuda a no rendirme en el colegio." }
];

async function poblarBBDD() {
    try {
        console.log("Iniciando inyección de datos a Firebase Firestore (V2 - CEIA)...");

        // 1. Tests
        for (const t of tests) {
            await setDoc(doc(db, "tests", t.id), {
                name: t.name,
                description: t.description,
                type: t.type,
                active: t.active
            });
            console.log(`✅ Test CEIA actualizado: ${t.id}`);
        }

        // 2. Preguntas CHAEA
        for (const q of preguntasCHAEA) {
            await setDoc(doc(db, "preguntas_chaea", q.id), {
                order: q.order,
                text: q.text,
                category: q.category
            });
            console.log(`✅ Pregunta CHAEA agregada: ${q.id}`);
        }

        // 3. Situaciones SV-RES
        for (const s of preguntasSVRES) {
            await setDoc(doc(db, "preguntas_svres", s.id), {
                order: s.order,
                text: s.text
            });
            console.log(`✅ Pregunta SV-RES agregada: ${s.id}`);
        }

        console.log("🎉 ¡Base de datos poblada exitosamente con instrumentos CEIA profesionales!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error poblando base de datos:", error);
        process.exit(1);
    }
}

poblarBBDD();
