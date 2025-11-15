import { createContext, useContext } from "react"
import { AppUser } from "../utils/userSession"

export type UserContextType = {
  user: AppUser | null
}

export const UserContext = createContext<UserContextType>({ user: null })

export function useUser() {
  return useContext(UserContext)
}

export const UserProvider = UserContext.Provider

