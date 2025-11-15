import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { v4 as uuidv4 } from "uuid"
// Use relative import for firebaseConfig, works from both app/ and root
import { auth } from "../firebaseConfig"

// Use a single key for user storage
const USER_KEY = "appUser"

export interface AppUser {
  userId: string
  createdAt: string
  streak: number
}

// Update the user's streak in AsyncStorage
export async function updateUserStreak(newStreak: number): Promise<void> {
  const userJson = await AsyncStorage.getItem(USER_KEY)
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson)
      parsed.streak = newStreak
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(parsed))
    } catch (err) {
      console.error('Failed to update user streak:', err)
    }
  }
}

export async function ensureAnonymousSignIn(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe()
        resolve(user)
      } else {
        try {
          const cred = await signInAnonymously(auth)
          unsubscribe()
          resolve(cred.user)
        } catch (err) {
          unsubscribe()
          reject(err)
        }
      }
    })
  })
}

// Try to get user from AsyncStorage
export async function getOrCreateUser(): Promise<AppUser> {
  const userJson = await AsyncStorage.getItem(USER_KEY)
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson)
      // Always return with streak: number
      return {
        userId: parsed.userId,
        createdAt: parsed.createdAt,
        streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      }
    } catch (err) {
      // Corrupted or invalid data, remove and create new user
      await AsyncStorage.removeItem(USER_KEY)
    }
  }
  // Create new user
  const newUser: AppUser = {
    userId: uuidv4(),
    createdAt: new Date().toISOString(),
    streak: 0,
  }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser))
  return newUser
}

