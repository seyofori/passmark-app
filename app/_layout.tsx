import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useFonts } from "expo-font"
import * as Notifications from "expo-notifications"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Text, View } from "react-native"
import "react-native-get-random-values"
import { AppUser, ensureAnonymousSignIn, getOrCreateUser } from "../userSession"

const queryClient = new QueryClient()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend: require("../assets/fonts/Lexend-VariableFont_wght.ttf"),
  })
  const [user, setUser] = useState<AppUser | null>(null)
  const [userReady, setUserReady] = useState(false)

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: false,
      }),
    })

    async function setupNotification() {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Notification Permission",
          "Please enable notifications to receive daily reminders.",
        )
        return
      }
      const scheduled = await Notifications.getAllScheduledNotificationsAsync()
      const alreadyScheduled = scheduled.some((n) => {
        const t = n.trigger as Notifications.CalendarTriggerInput
        return (
          t &&
          t.type === "calendar" &&
          //@ts-ignore
          t.dateComponents.hour === 7 &&
          //@ts-ignore
          t.dateComponents.minute === 0 &&
          t.repeats === true
        )
      })
      if (!alreadyScheduled) {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Don't lose your streak!",
              body: "Work on today's problem to keep your math streak alive!",
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
              hour: 7,
              minute: 0,
              repeats: true,
            } as Notifications.CalendarTriggerInput,
          })
        } catch (error) {
          console.error("Failed to schedule notification:", error)
          Alert.alert(
            "Notification Error",
            "Unable to schedule daily reminder. Please check your notification permissions.",
          )
        }
      }
    }

    async function setupUser() {
      try {
        const u = await getOrCreateUser()
        setUser(u)
        await ensureAnonymousSignIn()
        setUserReady(true)
      } catch (err) {
        console.error("User setup error:", err)
        Alert.alert("User Error", "Failed to initialize user session.")
        setUserReady(false)
      }
    }

    ;(async () => {
      await setupNotification()
      await setupUser()
    })()
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
  )
}

