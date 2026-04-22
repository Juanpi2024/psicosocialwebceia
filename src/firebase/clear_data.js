import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

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

async function clearAllData() {
    console.log("🗑️  Eliminando TODOS los documentos de testResults...");
    try {
        const querySnapshot = await getDocs(collection(db, "testResults"));
        console.log(`Se encontraron ${querySnapshot.size} documentos para eliminar.`);
        
        let count = 0;
        for (const docSnap of querySnapshot.docs) {
            await deleteDoc(doc(db, "testResults", docSnap.id));
            count++;
            if (count % 10 === 0) console.log(`  Eliminados ${count}/${querySnapshot.size}...`);
        }
        
        console.log(`✅ ${count} documentos eliminados exitosamente.`);
        console.log("🧹 Base de datos limpia. Lista para datos nuevos.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al eliminar datos:", error);
        process.exit(1);
    }
}

clearAllData();
