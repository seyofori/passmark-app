// firebaseConfig.ts
// Firebase config using environment variables for security and validation.

import { initializeApp } from "firebase/app"
import { initializeAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

function getEnvVar(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const firebaseConfig = {
  apiKey: getEnvVar(
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    "EXPO_PUBLIC_FIREBASE_API_KEY",
  ),
  authDomain: getEnvVar(
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  ),
  projectId: getEnvVar(
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  ),
  storageBucket: getEnvVar(
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  ),
  messagingSenderId: getEnvVar(
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  ),
  appId: getEnvVar(
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ),
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
    ? getEnvVar(
        process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
        "EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID",
      )
    : undefined, // Optional
}

// Initialize Firebase

export const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

