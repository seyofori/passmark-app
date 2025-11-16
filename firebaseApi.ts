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
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"
import { z } from "zod"
import { ai, db } from "./firebaseConfig"
import { getOrCreateUser, updateUserStreak } from "./utils/userSession"

// Submit solution for AI grading

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
    model: "gemini-2.5-flash",
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

async function saveGradingResultToFirestore(params: {
  userId: string
  questionId: string
  uploadedUrls: string[]
  score: number
  feedback: FeedbackItem[]
  question: string
}): Promise<string> {
  const { userId, questionId, score, feedback, question } = params
  const gradingResultsCol = collection(db, "users", userId, "gradingResults")
  // Query for existing gradingResult for this user/question
  const q = query(
    gradingResultsCol,
    where("questionId", "==", questionId),
    limit(1),
  )
  const snapshot = await getDocs(q)
  let docRef
  if (!snapshot.empty) {
    // Update existing doc
    docRef = snapshot.docs[0].ref
    await setDoc(
      docRef,
      {
        userId,
        questionId,
        imageUrls: [],
        createdAt: serverTimestamp(),
        score,
        feedback,
        question,
      },
      { merge: true },
    )
  } else {
    // Add new doc
    const { addDoc } = await import("firebase/firestore")
    docRef = await addDoc(gradingResultsCol, {
      userId,
      questionId,
      imageUrls: [],
      createdAt: serverTimestamp(),
      score,
      feedback,
      question,
    })
  }
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
    // 2. AI Grading
    const { score, feedback } = await runAiGrading(imageUris, question)

    if (score > -1) {
      const user = await getOrCreateUser()
      const lastStreakDate = user.lastStreakDate
        ? new Date(user.lastStreakDate)
        : null
      const today = new Date()
      const isSameDay =
        lastStreakDate &&
        lastStreakDate.getFullYear() === today.getFullYear() &&
        lastStreakDate.getMonth() === today.getMonth() &&
        lastStreakDate.getDate() === today.getDate()

      // Helper to check if last streak date is yesterday
      function isYesterday(date: Date, today: Date) {
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        return (
          date.getFullYear() === yesterday.getFullYear() &&
          date.getMonth() === yesterday.getMonth() &&
          date.getDate() === yesterday.getDate()
        )
      }

      if (!isSameDay) {
        let newStreak = 1
        if (lastStreakDate && isYesterday(lastStreakDate, today)) {
          newStreak = user.streak + 1
        }
        await updateUserStreak(newStreak)
      } else {
        // Optionally alert or log that streak was already updated today
        // alert('Streak already updated today')
      }
    }

    // 3. Save grading result
    const gradingResultId = await saveGradingResultToFirestore({
      userId,
      questionId,
      uploadedUrls: [],
      score,
      feedback,
      question,
    })

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
  createdAt: string
  question: string
  score: number
}

export interface HistoryDetail extends HistoryItem {
  // Add more specific fields if needed
}

export interface GradingResult {
  id: string
  score: number
  feedback: FeedbackItem[]
  question: string
  createdAt: string
}

// Fetch the daily question (example: from a 'dailyQuestions' collection)
export async function fetchDailyQuestion(): Promise<DailyQuestion> {
  const q = query(
    collection(db, "questions"),
    where("isActive", "==", true),
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
    collection(db, "users", userId, "gradingResults"),
    orderBy("createdAt", "desc"),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data() as DocumentData
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? "",
      question: data.question,
      score: typeof data.score === "number" ? data.score : 0,
    }
  })
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
    ...data,
    id: docSnap.id,
    score: typeof data.score === "number" ? data.score : 0,
    feedback: Array.isArray(data.feedback) ? data.feedback : [],
    question: data.question ?? "",
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? "",
  }
}

// Fetch the latest grading result for a user and questionId
export async function fetchLatestGradingResultForQuestion(
  userId: string,
  questionId: string,
): Promise<GradingResult | null> {
  const q = query(
    collection(db, "users", userId, "gradingResults"),
    where("questionId", "==", questionId),
    orderBy("createdAt", "desc"),
    limit(1),
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as GradingResult
}

