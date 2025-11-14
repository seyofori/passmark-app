// firebaseApi.ts
// Real API functions using Firebase services (Firestore, Auth, Storage)
import { readAsStringAsync } from "expo-file-system/legacy"
import { getGenerativeModel, Schema } from "firebase/ai"
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { z } from "zod"
import { ai, db, storage } from "./firebaseConfig"

// Submit solution for AI grading

// --- Helper Functions ---
async function uploadImagesToStorage(
  userId: string,
  questionId: string,
  imageUris: string[],
): Promise<string[]> {
  const uploadedUrls: string[] = []
  for (let i = 0; i < imageUris.length; i++) {
    const uri = imageUris[i]
    const response = await fetch(uri)
    const blob = await response.blob()
    const storageRef = ref(
      storage,
      `solutions/${userId}/${questionId}/${Date.now()}_${i}.jpg`,
    )
    await uploadBytes(storageRef, blob)
    const downloadUrl = await getDownloadURL(storageRef)
    uploadedUrls.push(downloadUrl)
  }
  return uploadedUrls
}

async function fileToGenerativePart(uri: string, mimeType: string) {
  const base64 = await readAsStringAsync(uri, { encoding: "base64" })
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  }
}

function getGradingPrompt(question: string) {
  return `\nYou will receive one or more images.\nIf the images contain a handwritten or written math solution to the following question, grade it and provide useful feedback on the correctness of the solution.\nIf the images do not contain a math solution, respond with a score of 0 and feedback: \"No valid solution detected.\"\nQuestion: ${question}\n`
}

function getResponseSchema() {
  return Schema.object({
    properties: {
      score: Schema.number({ maximum: 100, minimum: 0 }),
      feedback: Schema.array({
        items: Schema.object({
          properties: {
            title: Schema.string(),
            text: Schema.string(),
            type: Schema.enumString({ enum: ["success", "error", "info"] }),
          },
        }),
      }),
    },
  })
}

function getValidationSchema() {
  return z.object({
    score: z.number().min(0).max(100),
    feedback: z.array(
      z.object({
        title: z.string(),
        text: z.string(),
        type: z.enum(["success", "error", "info"]),
      }),
    ),
  })
}

export interface FeedbackItem {
  title: string
  text: string
  type: "success" | "error" | "info"
}

async function runAiGrading(
  uploadedUrls: string[],
  question: string,
): Promise<{ score: number; feedback: FeedbackItem[] }> {
  const gradingPrompt = getGradingPrompt(question)
  const responseSchema = getResponseSchema()
  const model = getGenerativeModel(ai, {
    model: "gemini-2.5-pro",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  })

  const imageParts = await Promise.all(
    uploadedUrls.map((url) => fileToGenerativePart(url, "image/jpeg")),
  )
  const result = await model.generateContent([gradingPrompt, ...imageParts])
  const response = result.response.text()
  const validationSchema = getValidationSchema()
  return validationSchema.parse(JSON.parse(response))
}

async function saveGradingResultToFirestore(
  userId: string,
  questionId: string,
  uploadedUrls: string[],
  score: number,
  feedback: FeedbackItem[],
): Promise<string> {
  const gradingResultsCol = collection(db, "users", userId, "gradingResults")
  const { addDoc } = await import("firebase/firestore")
  const docRef = await addDoc(gradingResultsCol, {
    userId,
    questionId,
    imageUrls: uploadedUrls,
    createdAt: new Date().toISOString(),
    status: "complete",
    score,
    feedback,
  })
  return docRef.id
}

export async function submitSolutionForGrading({
  userId,
  questionId,
  question,
  imageUris,
}: {
  userId: string
  question: string
  questionId: string
  imageUris: string[]
}): Promise<{ gradingResultId: string }> {
  try {
    // 1. Upload images
    const uploadedUrls = await uploadImagesToStorage(
      userId,
      questionId,
      imageUris,
    )

    // 2. AI Grading
    const { score, feedback } = await runAiGrading(imageUris, question)

    // 3. Save grading result
    const gradingResultId = await saveGradingResultToFirestore(
      userId,
      questionId,
      uploadedUrls,
      score,
      feedback,
    )

    // 4. Return the grading result id
    return { gradingResultId }
  } catch (err) {
    console.error("submitSolutionForGrading error", err)
    throw err
  }
}

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
  score: number
  feedback: FeedbackItem[]
  [key: string]: any
}

// Fetch the daily question (example: from a 'dailyQuestions' collection)
export async function fetchDailyQuestion(): Promise<DailyQuestion> {
  const q = query(
    collection(db, "questions"),
    where("isToday", "==", true),
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
    score: typeof data.score === "number" ? data.score : 0,
    feedback: Array.isArray(data.feedback) ? data.feedback : [],
    ...data,
  }
}

