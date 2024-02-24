import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAhm2nK-oXb7EdaaCHUBXkFW8BFvIxEhIA',
  authDomain: 'bit-group-chat.firebaseapp.com',
  projectId: 'bit-group-chat',
  storageBucket: 'bit-group-chat.appspot.com',
  messagingSenderId: '315106189673',
  appId: '1:315106189673:web:bc2379344279fa60509df8',
  measurementId: 'G-1SY0VG8M1E'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const bucket = getStorage(app)
const realtimeDB = getDatabase(app)

export { db, bucket, realtimeDB }
