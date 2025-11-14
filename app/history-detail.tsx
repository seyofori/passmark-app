import { Stack } from "expo-router"
import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"

// Dummy data for demonstration
const questionDetails = {
  id: "1",
  date: "Oct 26, 2023",
  question:
    "Solve the following integral: ∫(3x^2 + 2x - 5) dx. Show all steps of your calculation and provide the final simplified answer.",
  images: [1, 2],
  grade: 85,
  feedback: [
    {
      type: "success",
      title: "Correct Application of Power Rule",
      text: "You correctly applied the power rule for integration to the 3x² and 2x terms.",
    },
    {
      type: "success",
      title: "Constant of Integration",
      text: "Great job remembering to add the constant of integration, '+ C'. This is a crucial step!",
    },
    {
      type: "error",
      title: "Minor Calculation Error",
      text: "There seems to be a small error in the integration of the constant term (-5). Remember that the integral of a constant 'k' is 'kx'.",
    },
  ],
}

function getFeedbackIcon(type: string) {
  if (type === "success") return "✅"
  if (type === "error") return "❌"
  return ""
}

function getGradeColor(grade: number) {
  if (grade >= 85) return "#43B649"
  if (grade >= 60) return "#FFA500"
  return "#F44336"
}

export default function HistoryDetailScreen() {
  // const { id } = useLocalSearchParams();
  // Fetch question details by id if using real data
  const q = questionDetails
  const scoreColor = getGradeColor(q.grade)

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: `Question from ${q.date}`,
          headerBackTitle: "History",
          headerBackTitleStyle: { fontFamily: "Lexend" },
        }}
      />
      {/* Question Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Question</Text>
        <Text style={styles.cardQuestion}>{q.question}</Text>
      </View>
      {/* Solution Images */}
      <Text style={styles.sectionTitle}>Your Solution</Text>
      <View style={styles.solutionImagesRow}>
        {q.images.map((img, idx) => (
          <View key={idx} style={styles.solutionImageWrapper}>
            <View style={styles.solutionImage} />
            <Text style={styles.solutionPageLabel}>Page {idx + 1}</Text>
            <Text style={styles.solutionPageHint}>Tap to view full screen</Text>
          </View>
        ))}
      </View>
      {/* Results & Feedback */}
      <Text style={styles.sectionTitle}>Results & Feedback</Text>
      <View style={styles.resultCard}>
        <View style={styles.scoreCircleWrapper}>
          <View style={[styles.scoreCircleBg, { borderColor: scoreColor }]}>
            <Text style={styles.scoreText}>{q.grade}</Text>
            <Text style={styles.scoreOutOf}>/ 100</Text>
          </View>
        </View>
        <Text style={styles.feedbackLabel}>AI Feedback:</Text>
        <View style={{ gap: 20 }}>
          {q.feedback.map((f, idx) => (
            <View key={idx} style={styles.feedbackRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.feedbackIcon,
                    f.type === "success" ? styles.success : styles.error,
                  ]}
                >
                  {getFeedbackIcon(f.type)}
                </Text>
                <Text style={styles.feedbackTitle}>{f.title}:</Text>
              </View>
              <Text style={styles.feedbackText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 0,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardLabel: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    color: "#AAA",
    fontSize: 18,
    marginBottom: 8,
  },
  cardQuestion: {
    fontFamily: "Lexend",
    fontSize: 18,
    color: "#222",
  },
  sectionTitle: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 8,
    color: "#222",
  },
  solutionImagesRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 16,
  },
  solutionImageWrapper: {
    alignItems: "center",
    flex: 1,
  },
  solutionImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: "#F1F1F1",
  },
  solutionPageLabel: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 14,
    color: "#222",
  },
  solutionPageHint: {
    fontFamily: "Lexend",
    fontSize: 12,
    color: "#AAA",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scoreCircleWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  scoreCircleBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  scoreText: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 36,
    color: "#222",
  },
  scoreOutOf: {
    fontFamily: "Lexend",
    fontSize: 16,
    color: "#AAA",
  },
  feedbackLabel: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#222",
  },
  feedbackRow: {
    alignItems: "flex-start",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  feedbackIcon: {
    fontSize: 18,
    marginRight: 6,
    marginTop: 2,
  },
  feedbackTitle: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 4,
    color: "#222",
  },
  feedbackText: {
    fontFamily: "Lexend",
    fontSize: 15,
    color: "#222",
    flex: 1,
  },
  success: {
    color: "#43B649",
  },
  error: {
    color: "#F44336",
  },
})

