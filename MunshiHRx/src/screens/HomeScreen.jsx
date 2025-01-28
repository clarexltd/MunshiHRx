import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"
import { useFocusEffect } from "@react-navigation/native"
import Header from "../components/Header"

const HomeScreen = () => {
  useCustomBackHandler("custom", () => {
    // Handle custom back action if needed
    return true
  })

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Header title="Home" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome to MunshiHRx!</Text>
          <Text style={styles.subText}>Your HR management solution</Text>
        </View>
        {/* Add more content for the home screen here */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: scale(24),
    paddingTop: scale(16),
  },
  card: {
    backgroundColor: colors.card.background,
    borderRadius: scale(16),
    padding: scale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 3,
  },
  welcomeText: {
    ...colors.typography.header,
    fontSize: moderateScale(24),
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  subText: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.secondary,
    textAlign: "center",
  },
})

export default HomeScreen

