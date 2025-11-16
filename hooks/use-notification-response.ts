import * as Notifications from "expo-notifications"
import { router } from "expo-router"
import { useEffect } from "react"

/**
 * Hook to handle notification responses
 * When user taps a notification, navigate to the appropriate screen
 */
export function useNotificationResponse() {
  useEffect(() => {
    // Handle notification response when user taps on it
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data?.screen

        // Navigate to home screen when notification is tapped
        if (screen === "home") {
          router.push("/")
        }
      })

    return () => {
      responseSubscription.remove()
    }
  }, [])
}

