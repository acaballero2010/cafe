import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: "AIzaSyDA71Tfv4-V2obLLfU1sBiA3cAdyj-yI40",
  authDomain: "pourcraft-cafe-hq.firebaseapp.com",
  projectId: "pourcraft-cafe-hq",
  storageBucket: "pourcraft-cafe-hq.firebasestorage.app",
  messagingSenderId: "102615933507",
  appId: "1:102615933507:web:31f44081ddc7d5febeeaf6"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
