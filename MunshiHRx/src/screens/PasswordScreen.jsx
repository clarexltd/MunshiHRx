import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PrimaryButton } from "../components/buttons/PrimaryButton"
import Header from "../components/Header"
import InputField from "../components/InputField"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"
import { login, requestOTP } from "../services/api"

const PasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { email, passwordExists } = route.params

  useCustomBackHandler("goBack")

  const handleSignIn = async () => {
    setLoading(true)
    setError("")
    try {
      const { token } = await login(email, password)
      navigation.replace("Main")
    } catch (error) {
      console.error("Sign in error:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setLoading(true)
    setError("")
    try {
      await requestOTP(email)
      navigation.navigate("OTP", { email, isReset: true })
    } catch (error) {
      console.error("Request OTP error:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Header title={email} leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Password</Text>
          <InputField
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.forgotText} onPress={handleForgotPassword}>
            Forgot Password?
          </Text>

          <PrimaryButton
            title="Sign In"
            onPress={handleSignIn}
            style={styles.button}
            loading={loading}
            disabled={!password.trim()}
          />
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
  forgotText: {
    ...colors.typography.caption,
    fontSize: moderateScale(13),
    color: colors.text.secondary,
    textAlign: "right",
    marginBottom: verticalScale(24),
  },
  button: {
    backgroundColor: colors.button.primary,
    height: verticalScale(48),
  },
})

export default PasswordScreen

