import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PrimaryButton } from "../components/buttons/PrimaryButton"
import Header from "../components/Header"
import InputField from "../components/InputField"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"
import { setPassword } from "../services/api"
import CustomAlert from "../components/CustomAlert"

const SetPasswordScreen = ({ navigation, route }) => {
  const [password, setPasswordState] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const { email, isReset } = route.params

  useCustomBackHandler("goBack")

  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasNonalphas = /\W/.test(password)
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas
  }

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.",
      )
      return
    }

    setLoading(true)
    setError("")
    try {
      await setPassword(email, password)
      setLoading(false)
      setShowAlert(true)
    } catch (error) {
      console.error("Set password error:", error.message)
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Header
        title={isReset ? "Reset Password" : "Set Password"}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>New Password</Text>
          <InputField
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPasswordState}
            placeholder="Enter new password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <InputField
            icon="lock-closed-outline"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton
            title={isReset ? "Reset Password" : "Set Password"}
            onPress={handleSetPassword}
            style={styles.button}
            loading={loading}
            disabled={!password.trim() || !confirmPassword.trim()}
          />
        </View>
      </ScrollView>
      <CustomAlert
        visible={showAlert}
        title="Success"
        message={isReset ? "Your password has been reset successfully." : "Your password has been set successfully."}
        onClose={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false)
          navigation.replace("Login")
        }}
      />
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
  button: {
    backgroundColor: colors.button.primary,
    height: verticalScale(48),
    marginTop: verticalScale(16),
  },
})

export default SetPasswordScreen

