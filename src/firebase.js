import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: "AIzaSyAi9KdQAuOdyEo1T3SURKMjKJ3iVWeABb0",
  authDomain: "sapc-intellysys-ph.firebaseapp.com",
  projectId: "sapc-intellysys-ph",
  storageBucket: "sapc-intellysys-ph.firebasestorage.app",
  messagingSenderId: "923880712593",
  appId: "1:923880712593:web:ae19bc4dce5ca69d519230"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
