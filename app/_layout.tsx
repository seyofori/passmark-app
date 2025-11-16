import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useFonts } from "expo-font"
import * as Notifications from "expo-notifications"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Text, View } from "react-native"
import "react-native-get-random-values"
import {
  AppUser,
  ensureAnonymousSignIn,
  getOrCreateUser,
} from "../utils/userSession"
import { UserProvider } from "./UserContext"
import { useNotificationResponse } from "@/hooks/use-notification-response"
import { initializeDailyNotifications } from "@/utils/notifications"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Note: Individual hooks (e.g., use-challenges) can override staleTime as needed.
    },
  },
})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend: require("../assets/fonts/Lexend-VariableFont_wght.ttf"),
  })
  const [user, setUser] = useState<AppUser | null>(null)
  const [userReady, setUserReady] = useState(false)

  // Set up notification response handling
  useNotificationResponse()

  // Initialize daily notifications when app starts
  useEffect(() => {
    const setupNotifications = async () => {
      await initializeDailyNotifications()
    }
    setupNotifications()
  }, [])

  useEffect(() => {
    async function setupUser() {
      try {
        const u = await getOrCreateUser()
        setUser(u)
        await ensureAnonymousSignIn()
        setUserReady(true)
      } catch (err) {
        console.error("User setup error:", err)
        Alert.alert("User Error", "Failed to initialize user session.")
      }
    }

    async function initializeApp() {
      await setupUser()
    }
    initializeApp()
  }, [])

  if (!fontsLoaded || !userReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text
          style={{
            marginTop: 16,
            fontFamily: "Lexend",
            color: "#4CAF50",
            fontSize: 16,
          }}
        >
          Loading...
        </Text>
      </View>
    )
  }

  return (
    <UserProvider value={{ user }}>
      <QueryClientProvider client={queryClient}>
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#F9FAFB" },
              headerTitleStyle: { fontFamily: "Lexend" },
            }}
          />
        </View>
      </QueryClientProvider>
    </UserProvider>
  )
}

