import { useQuery } from "@tanstack/react-query"
import { format, isThisWeek, isToday, isYesterday } from "date-fns"
import { Stack, useLocalSearchParams } from "expo-router"
import React from "react"
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import {
  fetchGradingResult as fetchHistoryDetailFirebase,
  GradingResult,
} from "../firebaseApi"
import { useUser } from "./UserContext"

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
  const { id } = useLocalSearchParams()
  const { user } = useUser()
  const userId = user?.userId

  const {
    data: historyDetail,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<GradingResult>({
    queryKey: ["history-detail", userId, id],
    queryFn: ({ queryKey }) => {
      const [, uid, qid] = queryKey
      return fetchHistoryDetailFirebase(uid as string, qid as string)
    },
    enabled: !!userId && typeof id === "string" && id.length > 0,
  })
  const scoreColor = historyDetail ? getGradeColor(historyDetail.score) : "#AAA"

  const onRefresh = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Text
          style={{
            fontFamily: "Lexend",
            color: "#4CAF50",
            marginTop: 40,
          }}
        >
          Loading details...
        </Text>
      </ScrollView>
    )
  }
  if (isError) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Text
          style={{
            fontFamily: "Lexend",
            color: "#F44336",
            marginTop: 40,
            marginBottom: 8,
          }}
        >
          Failed to load details.
        </Text>
        <Text
          style={{
            fontFamily: "Lexend",
            color: "#AAA",
            marginBottom: 16,
          }}
        >
          Check your connection and try again.
        </Text>
        <Text
          onPress={() => refetch()}
          style={{
            color: "#4CAF50",
            fontFamily: "Lexend",
            fontWeight: "bold",
            fontSize: 16,
            padding: 10,
            borderRadius: 8,
            backgroundColor: "#E8F5E9",
          }}
        >
          Retry
        </Text>
      </ScrollView>
    )
  }
  if (!historyDetail) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Text
          style={{
            fontFamily: "Lexend",
            color: "#F44336",
            marginTop: 40,
            marginBottom: 8,
          }}
        >
          No details found for this question.
        </Text>
        <Text style={{ fontFamily: "Lexend", color: "#AAA", marginBottom: 16 }}>
          The requested data could not be found. It may have been deleted or is
          unavailable.
        </Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={onRefresh}
          tintColor="#4CAF50"
        />
      }
    >
      <Stack.Screen
        options={{
          title: `Question from ${(() => {
            const dateObj = new Date(historyDetail.createdAt)
            if (isToday(dateObj)) return "Today"
            if (isYesterday(dateObj)) return "Yesterday"
            if (isThisWeek(dateObj, { weekStartsOn: 1 }))
              return format(dateObj, "EEEE")
            return format(dateObj, "MMM d, yyyy")
          })()}`,
          headerBackTitle: "History",
          headerBackTitleStyle: { fontFamily: "Lexend" },
        }}
      />
      {/* Question Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Question</Text>
        <Text style={styles.cardQuestion}>{historyDetail.question}</Text>
      </View>

      {/* Results & Feedback */}
      <Text style={styles.sectionTitle}>Results & Feedback</Text>
      <View style={styles.resultCard}>
        <View style={styles.scoreCircleWrapper}>
          <View style={[styles.scoreCircleBg, { borderColor: scoreColor }]}>
            <Text style={styles.scoreText}>{historyDetail.score}</Text>
            <Text style={styles.scoreOutOf}>/ 100</Text>
          </View>
        </View>
        <Text style={styles.feedbackLabel}>AI Feedback:</Text>
        <View style={{ gap: 20 }}>
          {historyDetail.feedback.map(
            (f: GradingResult["feedback"][number], idx: number) => (
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
            ),
          )}
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

