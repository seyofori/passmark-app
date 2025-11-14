// firebaseApi.ts
// Real API functions using Firebase services (Firestore, Auth, Storage)
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore"
import { db } from "./firebaseConfig"

// --- Types ---
export interface DailyQuestion {
  id: string
  question: string
  streak: number
}

export interface HistoryItem {
  id: string
  date: string
  [key: string]: any
}

export interface HistoryDetail extends HistoryItem {
  // Add more specific fields if needed
}

export interface GradingResult {
  id: string
  [key: string]: any
}

// Fetch the daily question (example: from a 'dailyQuestions' collection)
export async function fetchDailyQuestion(): Promise<DailyQuestion> {
  const q = query(
    collection(db, "dailyQuestions"),
    orderBy("date", "desc"),
    limit(1),
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) throw new Error("No daily question found")
  const docData = snapshot.docs[0].data() as DocumentData
  return {
    id: snapshot.docs[0].id,
    question: docData.question as string,
    streak: typeof docData.streak === "number" ? docData.streak : 0,
  }
}

// Fetch user history (example: from a 'history' collection)
export async function fetchHistory(userId: string): Promise<HistoryItem[]> {
  const q = query(
    collection(db, "users", userId, "history"),
    orderBy("date", "desc"),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data() as DocumentData
    return {
      id: doc.id,
      date: data.date as string,
      ...data,
    }
  })
}

// Fetch details for a specific question in history
export async function fetchHistoryDetail(
  userId: string,
  questionId: string,
): Promise<HistoryDetail> {
  const docRef = doc(db, "users", userId, "history", questionId)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error("History detail not found")
  const data = docSnap.data() as DocumentData
  return {
    id: docSnap.id,
    date: data.date as string,
    ...data,
  }
}

// Fetch grading result (example: from a 'gradingResults' collection)
export async function fetchGradingResult(
  userId: string,
  resultId: string,
): Promise<GradingResult> {
  const docRef = doc(db, "users", userId, "gradingResults", resultId)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error("Grading result not found")
  const data = docSnap.data() as DocumentData
  return {
    id: docSnap.id,
    ...data,
  }
}

