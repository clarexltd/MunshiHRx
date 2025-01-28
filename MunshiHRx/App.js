import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AppNavigator from "./src/navigation/AppNavigator"
import { colors } from "./src/styles/colors"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { validateToken } from "./src/services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Logo from "./assets/logo"

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
  })

  useEffect(() => {
    async function prepare() {
      try {
        // Check token validity
        const isValid = await validateToken()
        setIsAuthenticated(isValid)
      } catch (e) {
        console.warn(e)
      } finally {
        setIsLoading(false)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, isLoading])

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Logo width={150} height={150} />
        <Text style={styles.loadingText}>Welcome to Munshi HR Solutions</Text>
        <Text style={styles.subText}>BY CLAREx</Text>
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" backgroundColor={colors.background} />
          <AppNavigator isAuthenticated={isAuthenticated} />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
})

