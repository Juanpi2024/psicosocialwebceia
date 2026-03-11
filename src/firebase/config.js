import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de nuestro proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCDC9z6BWEo1qgzheTq6rqHWFyVb0-9tAg",
    authDomain: "app-psicosocial-ceia.firebaseapp.com",
    projectId: "app-psicosocial-ceia",
    storageBucket: "app-psicosocial-ceia.firebasestorage.app",
    messagingSenderId: "825541972866",
    appId: "1:825541972866:web:a9776c022db1e63901759b"
};

// Inicializar y exportar la App y Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
