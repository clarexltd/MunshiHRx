import React, { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PrimaryButton } from "../components/buttons/PrimaryButton"
import Header from "../components/Header"
import InputField from "../components/InputField"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"
import { Ionicons } from "@expo/vector-icons"
import { verifyOTP } from "../services/api"

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { email, isReset, isNewUser } = route.params

  useCustomBackHandler("goBack")

  const handleVerifyOTP = async () => {
    setLoading(true)
    setError("")
    try {
      console.log("Verifying OTP...")
      await verifyOTP(email, otp)
      navigation.navigate("SetPassword", { email, isReset, isNewUser })
    } catch (error) {
      console.error("Verify OTP error:", error.message)
      setError(error.message || "Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Header title="Verify OTP" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.card}>
          <Ionicons name="shield-checkmark-outline" size={scale(48)} color={colors.primary} style={styles.icon} />
          <Text style={styles.title}>
            {isNewUser ? "Verify Your Email" : isReset ? "Reset Password" : "Verify OTP"}
          </Text>
          <Text style={styles.subtitle}>
            {isNewUser
              ? "We've sent a verification code to your email. Please enter it below to set up your account."
              : isReset
                ? "Enter the code we sent to reset your password."
                : "Enter the verification code we sent to your email."}
          </Text>
          <Text style={styles.email}>{email}</Text>
          <InputField
            icon="key-outline"
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            maxLength={6}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <PrimaryButton
            title="Verify"
            onPress={handleVerifyOTP}
            style={styles.button}
            disabled={otp.length !== 6}
            loading={loading}
          />
        </View>
      </View>
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
    justifyContent: "center",
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
    alignItems: "center",
  },
  icon: {
    marginBottom: verticalScale(16),
  },
  title: {
    ...colors.typography.header,
    fontSize: moderateScale(24),
    color: colors.text.primary,
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  subtitle: {
    ...colors.typography.body,
    fontSize: moderateScale(14),
    color: colors.text.secondary,
    marginBottom: verticalScale(4),
    textAlign: "center",
  },
  email: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.primary,
    fontWeight: "bold",
    marginBottom: verticalScale(24),
    textAlign: "center",
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
    width: "100%",
  },
})

export default OTPScreen

