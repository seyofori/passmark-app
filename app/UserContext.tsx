import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { AppUser, getOrCreateUser } from "../utils/userSession"

export type UserContextType = {
  user: AppUser | null
  setUser: (user: AppUser | null) => void
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
})

export function useUser() {
  return useContext(UserContext)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)

  const refreshUser = useCallback(async () => {
    const u = await getOrCreateUser()
    setUser(u)
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

