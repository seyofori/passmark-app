import { useQuery } from "@tanstack/react-query"
import { format, isThisWeek, isToday, isYesterday } from "date-fns"
import { Stack, useRouter } from "expo-router"
import React from "react"
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native"
import {
  fetchHistory as fetchHistoryFirebase,
  HistoryItem,
} from "../firebaseApi"
import { useUser } from "./UserContext"

function getGradeColor(grade: number) {
  if (grade >= 90) return "#43B649"
  if (grade >= 70) return "#FFA500"
  return "#F44336"
}

export default function HistoryScreen() {
  const router = useRouter()
  const { user } = useUser()
  const userId = user?.userId
  const {
    data: historyData,
    error, //TODO: report this error to logging service in future
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<HistoryItem[]>({
    queryKey: ["history", userId],
    queryFn: ({ queryKey }) => {
      const [, uid] = queryKey
      return fetchHistoryFirebase(uid as string)
    },
    enabled: !!userId,
  })

  const onRefresh = () => {
    refetch()
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "History",
          headerBackTitle: "Home",
          headerBackTitleStyle: { fontFamily: "Lexend" },
        }}
      />
      {isLoading && (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ fontFamily: "Lexend", color: "#4CAF50" }}>
            Loading history...
          </Text>
        </View>
      )}
      {isError && (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text
            style={{
              fontFamily: "Lexend",
              color: "#F44336",
              marginBottom: 8,
            }}
          >
            Failed to load history.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={{
              backgroundColor: "#4CAF50",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Lexend",
                fontWeight: "bold",
              }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      )}
      {!isLoading && !isError && historyData && (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: "/history-detail",
                  params: { id: item.id },
                })
              }
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  marginRight: 16,
                  backgroundColor: "#F1F1F1",
                }}
              />
              <View style={styles.infoContainer}>
                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={styles.title}
                >
                  {item.question}
                </Text>
                <Text style={styles.date}>
                  {(() => {
                    const dateObj = new Date(item.createdAt)
                    if (isToday(dateObj)) return "Today"
                    if (isYesterday(dateObj)) return "Yesterday"
                    if (isThisWeek(dateObj, { weekStartsOn: 1 }))
                      return format(dateObj, "EEEE")
                    return format(dateObj, "MMM d, yyyy")
                  })()}
                </Text>
              </View>
              <View
                style={[
                  styles.gradeBadge,
                  { backgroundColor: getGradeColor(item.score) },
                ]}
              >
                <Text style={styles.gradeText}>{item.score}/100</Text>
              </View>
            </Pressable>
          )}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No history yet.</Text>
              <Text style={styles.emptySubtitle}>
                Your solved questions will appear here.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onRefresh}
              tintColor="#4CAF50"
            />
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#F1F1F1",
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "Lexend",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222222",
  },
  date: {
    fontFamily: "Lexend",
    fontSize: 14,
    color: "#AAAAAA",
  },
  gradeBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  gradeText: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: "Lexend",
    fontSize: 18,
  },
  emptySubtitle: {
    fontFamily: "Lexend",
    fontSize: 14,
    opacity: 0.5,
    marginTop: 8,
  },
})

