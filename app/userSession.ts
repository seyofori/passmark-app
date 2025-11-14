import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { v4 as uuidv4 } from "uuid"
import { auth } from "../firebaseConfig"

const USER_KEY = "user_key"

export interface AppUser {
  userId: string
  createdAt: string
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

export async function getOrCreateUser(): Promise<AppUser> {
  // Try to get user from AsyncStorage
  const userJson = await AsyncStorage.getItem(USER_KEY)
  if (userJson) {
    try {
      return JSON.parse(userJson)
    } catch (err) {
      // Corrupted or invalid data, remove and create new user
      await AsyncStorage.removeItem(USER_KEY)
    }
  }
  // Create new user
  const newUser: AppUser = {
    userId: uuidv4(),
    createdAt: new Date().toISOString(),
  }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser))
  return newUser
}

