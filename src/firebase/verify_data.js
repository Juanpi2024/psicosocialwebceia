import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

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

async function verifyData() {
    console.log("Verificando datos en Firestore...");
    try {
        const q = query(collection(db, "testResults"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        console.log(`Se encontraron ${querySnapshot.size} resultados.`);
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`- [${doc.id}] Alumno: ${data.studentName}, Test: ${data.testId}, Perfil: ${data.profile}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al verificar datos:", error);
        process.exit(1);
    }
}

verifyData();
