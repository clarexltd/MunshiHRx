import React from "react"
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from "react-native"
import Header from "../components/Header"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"

const HomeScreen = ({ navigation }) => {
  useCustomBackHandler("custom", () => {
    Alert.alert(
      "Exit App",
      "Are you sure you want to exit?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false },
    )
    return true
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header title="MunshiHRx" rightIcon="bell-outline" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome to MunshiHRx!</Text>
          {/* Add your home screen content here */}
        </View>
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
    ...colors.typography.subheader,
    fontSize: moderateScale(18),
    color: colors.text.primary,
    textAlign: "center",
  },
})

export default HomeScreen

