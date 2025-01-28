import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { PrimaryButton } from "../components/buttons/PrimaryButton"
import Header from "../components/Header"
import InputField from "../components/InputField"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"
import { checkUser, requestOTP } from "../services/api"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useCustomBackHandler("exit")

  const handleContinue = async () => {
    setLoading(true)
    setError("")
    try {
      console.log("Attempting to check user...")
      const { passwordExists } = await checkUser(email)
      console.log("User check response:", { passwordExists })
      if (passwordExists) {
        navigation.navigate("Password", { email, passwordExists })
      } else {
        console.log("Requesting OTP for new user...")
        await requestOTP(email)
        navigation.navigate("OTP", { email, isNewUser: true })
      }
    } catch (error) {
      console.error("Login error:", error.message)
      setError(error.message || "An unexpected error occurred")
      Alert.alert("Login Error", error.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Header title="Sign In" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Ionicons name="shield-checkmark" size={scale(40)} color={colors.primary} />
              </View>
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.card}>
              <Text style={styles.label}>Email</Text>
              <InputField
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="done"
                onSubmitEditing={dismissKeyboard}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <PrimaryButton
                title="Continue"
                onPress={handleContinue}
                loading={loading}
                disabled={!email.trim()}
                style={styles.button}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: scale(24),
  },
  logoContainer: {
    alignItems: "center",
    marginTop: verticalScale(40),
    marginBottom: verticalScale(32),
  },
  logoBackground: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 3,
  },
  title: {
    ...colors.typography.header,
    fontSize: moderateScale(24),
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  subtitle: {
    ...colors.typography.subheader,
    fontSize: moderateScale(14),
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: verticalScale(32),
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
  label: {
    ...colors.typography.caption,
    fontSize: moderateScale(13),
    color: colors.text.secondary,
    marginBottom: verticalScale(8),
  },
  errorText: {
    ...colors.typography.caption,
    fontSize: moderateScale(12),
    color: "red",
    marginBottom: verticalScale(16),
  },
  button: {
    backgroundColor: colors.button.primary,
    height: verticalScale(48),
  },
})

export default LoginScreen

