import { FontAwesome } from "@expo/vector-icons"
import { Stack, useRouter } from "expo-router"
import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

function getGradeColor(grade: number) {
  if (grade >= 90) return "#43B649"
  if (grade >= 70) return "#FFA500"
  return "#F44336"
}

function getMotivationalMessage(grade: number) {
  if (grade >= 90) return "Excellent Work!"
  if (grade >= 70) return "Good Effort!"
  if (grade >= 50) return "Keep Practicing!"
  return "Don't Give Up!"
}

export default function GradingResultScreen() {
  const router = useRouter()
  // Replace with actual score from grading logic
  const score = 85
  const scoreColor = getGradeColor(score)
  const motivation = getMotivationalMessage(score)

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Your Result",
          headerBackTitle: "Solution",
          headerBackTitleStyle: { fontFamily: "Lexend" },
        }}
      />
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>{score}/100</Text>
        <Text style={[styles.motivation, { color: scoreColor }]}>{motivation}</Text>
      </View>
      <View style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>AI Analysis & Tips</Text>
        <Text style={styles.analysisText}>
          You excelled in Algebra but should review Geometry concepts like
          calculating the area of irregular shapes. Practice more problems
          involving theorems.
        </Text>
      </View>
      <View style={styles.bottomButtonWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.tryAgainButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.back()}
        >
          <FontAwesome
            name="refresh"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.tryAgainText}>Try Again</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  scoreContainer: {
    alignItems: "center",
    marginTop: 48,
    marginBottom: 24,
  },
  scoreText: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 64,
    marginBottom: 8,
  },
  motivation: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 24,
  },
  analysisCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  analysisTitle: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 20,
    color: "#222",
    marginBottom: 8,
  },
  analysisText: {
    fontFamily: "Lexend",
    fontSize: 16,
    color: "#608562",
  },
  bottomButtonWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },
  tryAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43B649",
    borderRadius: 12,
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: 18,
    width: "92%",
  },
  tryAgainText: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
})

