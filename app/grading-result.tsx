import { FontAwesome } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { Stack, useRouter, useLocalSearchParams } from "expo-router"
import { useUser } from "./UserContext"
import React from "react"
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import {
  fetchGradingResult as fetchGradingResultFirebase,
  GradingResult,
} from "../firebaseApi"

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
  // Accept both ?id= and ?resultId= for compatibility
  const params = useLocalSearchParams() as { id?: string; resultId?: string }
  const gradingResultId = params.id ?? params.resultId
  const { user } = useUser()
  const userId = user?.userId
  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<GradingResult>({
      queryKey: ["grading-result", userId, gradingResultId],
      queryFn: ({ queryKey }) => {
        const [, uid, rid] = queryKey
        return fetchGradingResultFirebase(uid as string, rid as string)
      },
      enabled: !!userId && !!gradingResultId,
    })

  const onRefresh = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Your Result",
            headerBackTitle: "Solution",
            headerBackTitleStyle: { fontFamily: "Lexend" },
          }}
        />
        <Text style={[styles.loadingText, styles.centerMessage]}>
          Loading result...
        </Text>
      </View>
    )
  }
  if (isError) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Your Result",
            headerBackTitle: "Solution",
            headerBackTitleStyle: { fontFamily: "Lexend" },
          }}
        />
        <Text style={[styles.errorText, styles.centerMessage]}>
          Failed to load result.
        </Text>
        <Pressable onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    )
  }
  if (!data) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Your Result",
            headerBackTitle: "Solution",
            headerBackTitleStyle: { fontFamily: "Lexend" },
          }}
        />
        <Text style={[styles.noDataText, styles.centerMessage]}>
          No grading result found.
        </Text>
      </View>
    )
  }

  const scoreColor = getGradeColor(data.score)
  const motivation = getMotivationalMessage(data.score)

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Your Result",
          headerBackTitle: "Solution",
          headerBackTitleStyle: { fontFamily: "Lexend" },
        }}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
          />
        }
      >
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>
            {data.score}/100
          </Text>
          <Text style={[styles.motivation, { color: scoreColor }]}>
            {motivation}
          </Text>
        </View>
        <View style={styles.analysisCard}>
          <Text style={styles.analysisTitle}>AI Feedback</Text>
          {Array.isArray(data.feedback) && data.feedback.length > 0 ? (
            data.feedback.map((item) => {
              const key = `${item.title}-${item.type}-${item.text}`
              let color = "#FFA500"
              if (item.type === "success") color = "#43B649"
              else if (item.type === "error") color = "#F44336"
              return (
                <View key={key} style={styles.feedbackItem}>
                  <Text style={[styles.feedbackTitle, { color }]}>{item.title}</Text>
                  <Text style={styles.feedbackText}>{item.text}</Text>
                </View>
              )
            })
          ) : (
            <Text style={styles.analysisText}>No feedback available.</Text>
          )}
        </View>
      </ScrollView>
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
  centerMessage: {
    marginTop: 60,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "Lexend",
    color: "#F44336",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingText: {
    fontFamily: "Lexend",
    color: "#4CAF50",
    textAlign: "center",
  },
  noDataText: {
    fontFamily: "Lexend",
    color: "#F44336",
    marginBottom: 8,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontFamily: "Lexend",
    fontWeight: "bold",
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
  feedbackItem: {
    marginBottom: 16,
  },
  feedbackTitle: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 16,
  },
  feedbackText: {
    fontFamily: "Lexend",
    color: "#222",
    fontSize: 15,
    marginTop: 2,
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

