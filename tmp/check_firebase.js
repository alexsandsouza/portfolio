import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAwxl9Sm6Q3X4z6GnFuUjm-lqf2tH2_a4Y",
    authDomain: "portfolio-b6e32.firebaseapp.com",
    projectId: "portfolio-b6e32",
    storageBucket: "portfolio-b6e32.firebasestorage.app",
    messagingSenderId: "809040838176",
    appId: "1:809040838176:web:fff2480b3c4c23cee48645"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
    const s = await getDocs(collection(db, 'hackersdobem_ranking'));
    console.log(`Total entries: ${s.docs.length}`);
    s.docs.forEach(d => {
        const data = d.data();
        console.log(`- ${data.name} (Module: ${data.module}, Score: ${data.score})`);
    });
}

check().catch(console.error);
