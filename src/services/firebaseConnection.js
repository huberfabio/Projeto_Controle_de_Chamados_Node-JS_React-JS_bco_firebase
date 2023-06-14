import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";        
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBHkiojBtVygmVinCmPLOQcvYoU-2S6Bls",
    authDomain: "called-22d4d.firebaseapp.com",
    projectId: "called-22d4d",
    storageBucket: "called-22d4d.appspot.com",
    messagingSenderId: "742393830481",
    appId: "1:742393830481:web:e0115ecf3f23c782b96c70",
    measurementId: "G-3PDCY2TVH3"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export { auth, db, storage };