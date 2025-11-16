import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

const DAILY_NOTIFICATION_ID_KEY = "daily_notification_id"
const DAILY_REMINDER_CHANNEL_ID = "daily_reminder"

/**
 * Creates the notification channel for Android
 * Required for Android 8.0+ to display notifications
 */
async function createNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return

  try {
    await Notifications.setNotificationChannelAsync(DAILY_REMINDER_CHANNEL_ID, {
      name: "Daily Reminders",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      bypassDnd: false,
    })
    console.log("Notification channel created:", DAILY_REMINDER_CHANNEL_ID)
  } catch (error) {
    console.error("Error creating notification channel:", error)
  }
}

/**
 * Requests notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync()
    return status === "granted"
  } catch (error) {
    console.error("Error requesting notification permissions:", error)
    return false
  }
}

/**
 * Calculates seconds until next 7am
 */
function secondsUntilNextSevenAM(): number {
  const now = new Date()
  const next7AM = new Date(now)
  next7AM.setHours(7, 0, 0, 0)

  // If 7am has already passed today, schedule for tomorrow's 7am
  if (next7AM <= now) {
    next7AM.setDate(next7AM.getDate() + 1)
  }

  const secondsUntil = Math.floor((next7AM.getTime() - now.getTime()) / 1000)
  return secondsUntil
}

/**
 * Schedules a daily notification at 7am
 * Should be called once at app startup or after user enables notifications
 */
export async function scheduleDailyNotification(): Promise<string | null> {
  try {
    // Cancel any existing daily notification
    await cancelDailyNotification()

    // Ensure notification channel exists on Android
    await createNotificationChannel()

    // Schedule the notification to repeat daily at 7am
    const trigger =
      Platform.OS === "android"
        ? {
            type: Notifications.SchedulableTriggerInputTypes.DAILY as const,
            hour: 7,
            minute: 0,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR as const,
            hour: 7,
            minute: 0,
            repeats: true,
          }
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Practice! 📚",
        body: "Ready for today's challenge? Practice now and get closer to your exam goal.",
        data: {
          screen: "home",
          type: "daily-reminder",
        },
        badge: 1,
        ...(Platform.OS === "android" && {
          channelId: DAILY_REMINDER_CHANNEL_ID,
        }),
      },
      trigger,
    })

    // Save the notification ID for potential future cancellation
    await AsyncStorage.setItem(DAILY_NOTIFICATION_ID_KEY, notificationId)

    console.log(`Daily notification scheduled for 7am `, notificationId)
    return notificationId
  } catch (error) {
    console.error("Error scheduling daily notification:", error)
    return null
  }
}

/**
 * Cancels the daily scheduled notification
 */
export async function cancelDailyNotification(): Promise<void> {
  try {
    const notificationId = await AsyncStorage.getItem(DAILY_NOTIFICATION_ID_KEY)
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId)
      await AsyncStorage.removeItem(DAILY_NOTIFICATION_ID_KEY)
      console.log("Daily notification cancelled")
    }
  } catch (error) {
    console.error("Error cancelling daily notification:", error)
  }
}

/**
 * Gets the status of notification permissions
 */
export async function getNotificationPermissionStatus(): Promise<
  "granted" | "denied" | "unknown"
> {
  try {
    const { status } = await Notifications.getPermissionsAsync()
    if (status === "granted") return "granted"
    if (status === "denied") return "denied"
    return "unknown"
  } catch (error) {
    console.error("Error getting notification permission status:", error)
    return "unknown"
  }
}

/**
 * Initializes daily notifications
 * Requests permissions and schedules the daily 7am notification
 */
export async function initializeDailyNotifications(): Promise<boolean> {
  try {
    // Create notification channel for Android
    await createNotificationChannel()

    const permissionStatus = await getNotificationPermissionStatus()

    if (permissionStatus === "denied") {
      console.log("Notification permissions denied by user")
      return false
    }

    if (permissionStatus === "unknown") {
      const granted = await requestNotificationPermissions()
      if (!granted) {
        console.log("User did not grant notification permissions")
        return false
      }
    }

    // Schedule the daily notification
    await scheduleDailyNotification()
    return true
  } catch (error) {
    console.error("Error initializing daily notifications:", error)
    return false
  }
}

