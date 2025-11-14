import { FontAwesome, FontAwesome6 } from "@expo/vector-icons"
import { Stack, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  })
  const router = useRouter()

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setDate(midnight.getDate() + 1)
      midnight.setHours(0, 0, 0, 0) // Set to next day's midnight

      const difference = midnight.getTime() - now.getTime()

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / (1000 * 60)) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      return {
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <View style={[styles.container, { paddingTop: 100 }]}>
      {/* Header */}
      <Stack.Screen
        options={{
          header: () => null,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>✅ Passmark</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: "#F9E9E5",
            padding: 10,
            paddingHorizontal: 14,
            borderRadius: 20,
          }}
        >
          <FontAwesome6 name="fire" size={18} color="#FF5722" />
          <Text style={[styles.streak, { marginLeft: 6 }]}>5 day streak</Text>
        </View>
      </View>
      <ScrollView style={{ marginTop: 30 }}>
        {/* Daily Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Problem of the Day</Text>
          <Text style={styles.questionText}>
            If a rectangle has a perimeter of 36 units and its length is twice
            its width, what is the area of the rectangle in square units?
          </Text>
          {/* Countdown Timer */}
          <View style={styles.timerContainer}>
            <View style={{ alignItems: "center" }}>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>{timeLeft.hours}</Text>
              </View>
              <Text style={styles.timerLabel}>Hours</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>{timeLeft.minutes}</Text>
              </View>
              <Text style={styles.timerLabel}>Minutes</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>{timeLeft.seconds}</Text>
              </View>
              <Text style={styles.timerLabel}>Seconds</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Submit Solution"
          style={({ pressed }) => [
            styles.submitButtonWrapper,
            pressed && styles.submitButtonPressed,
          ]}
          onPress={() => router.push("/submit-solution")}
        >
          <Text style={styles.buttonText}>Submit Solution</Text>
        </Pressable>
        <Pressable
          style={styles.historyButtonWrapper}
          onPress={() => router.push("/history")}
        >
          <FontAwesome name="history" size={16} color="#605b5bff" />
          <Text
            style={[
              styles.buttonText,
              { color: "#605b5bff", fontWeight: "bold", marginLeft: 8 },
            ]}
          >
            View History
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Lexend",
  },
  streak: {
    fontSize: 16,
    color: "#FF5722",
    fontFamily: "Lexend",
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 10,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Lexend",
  },
  questionText: {
    fontSize: 16,
    color: "#605b5bff",
    fontFamily: "Lexend",
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  timerBox: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF5722",
    fontFamily: "Lexend",
  },
  timerLabel: {
    fontSize: 14,
    color: "#605b5bff",
    fontFamily: "Lexend",
  },
  buttonText: {
    fontFamily: "Lexend",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 16,
  },
  submitButtonWrapper: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 10,
    alignItems: "center",
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  historyButtonWrapper: {
    justifyContent: "center",
    borderRadius: 8,
    color: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
  },
})

