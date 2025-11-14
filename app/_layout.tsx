import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { ActivityIndicator, Text, View } from "react-native"

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend: require("../assets/fonts/Lexend-VariableFont_wght.ttf"),
  })

  if (!fontsLoaded) {
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
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#F9FAFB" },
          headerTitleStyle: { fontFamily: "Lexend" },
        }}
      />
    </View>
  )
}

