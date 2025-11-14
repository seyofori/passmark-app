// userSession.ts
// Handles user info storage in AsyncStorage and anonymous sign-in
import AsyncStorage from "@react-native-async-storage/async-storage"
import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth"
import { v4 as uuidv4 } from "uuid"
import { auth } from "./firebaseConfig"

export interface AppUser {
  userId: string
  createdAt: string
}

const USER_KEY = "appUser"

export async function getOrCreateUser(): Promise<AppUser> {
  // Try to get user from AsyncStorage
  const userJson = await AsyncStorage.getItem(USER_KEY)
  if (userJson) {
    return JSON.parse(userJson)
  }
  // Create new user
  const newUser: AppUser = {
    userId: uuidv4(),
    createdAt: new Date().toISOString(),
  }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser))
  return newUser
}

export async function ensureAnonymousSignIn(): Promise<User> {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user)
      } else {
        try {
          const cred = await signInAnonymously(auth)
          resolve(cred.user)
        } catch (err) {
          reject(err)
        }
      }
    })
  })
}

