import { FontAwesome } from "@expo/vector-icons"
import { Stack, useRouter } from "expo-router"
import React, { useState } from "react"
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"

export default function SubmitSolutionScreen() {
  const [images, setImages] = useState([1, 2, 3])
  const router = useRouter()

  // Placeholder for image picking logic
  const handleTakePhoto = () => {}
  const handleUploadFromGallery = () => {}
  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }
  const handleClearImages = () => setImages([])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Stack.Screen
          options={{
            title: "Submit Your Solution",
            headerBackTitle: "Home",
            headerBackTitleStyle: { fontFamily: "Lexend" },
          }}
        />
        <Text style={styles.problemLabel}>Problem of the Day</Text>
        <View style={styles.inputRow}>
          <Pressable style={styles.inputBox} onPress={handleTakePhoto}>
            <FontAwesome name="camera" size={32} color="#4CAF50" />
            <Text style={styles.inputBoxTitle}>Take Photo</Text>
          </Pressable>
          <Pressable style={styles.inputBox} onPress={handleUploadFromGallery}>
            <FontAwesome name="upload" size={32} color="#4CAF50" />
            <Text style={styles.inputBoxTitle}>Upload from Gallery</Text>
          </Pressable>
        </View>
        <Text style={styles.imagesLabel}>Your Images ({images.length}/5)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesRow}
        >
          {images.map((img, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image source={img} style={styles.image} />
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveImage(idx)}
              >
                <FontAwesome name="close" size={18} color="#fff" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      <View style={styles.bottomButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push("/grading-result")}
        >
          <Text style={styles.submitButtonText}>Submit for Grading</Text>
        </Pressable>
        <Pressable
          onPress={handleClearImages}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.clearButtonText}>Clear and re-upload images</Text>
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
  },
  scrollContent: {
    paddingBottom: 160,
  },
  problemLabel: {
    fontFamily: "Lexend",
    fontSize: 18,
    color: "#605b5bff",
    marginLeft: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 16,
  },
  inputBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 24,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputBoxTitle: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 2,
    color: "#222",
  },
  imagesLabel: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 24,
    marginTop: 16,
    marginBottom: 8,
    color: "#222",
  },
  imagesRow: {
    marginLeft: 16,
    marginBottom: 24,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 16,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#F44336",
    borderRadius: 12,
    padding: 2,
    zIndex: 1,
  },
  bottomButtons: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: "#F9FAFB",
    gap: 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 8,
  },
  submitButtonText: {
    fontFamily: "Lexend",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  clearButton: {
    alignItems: "center",
  },
  clearButtonText: {
    fontFamily: "Lexend",
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
})

