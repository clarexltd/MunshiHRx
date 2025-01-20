import React, { useState } from "react"
import { View, Text, StyleSheet, TextInput, SafeAreaView } from "react-native"
import { PrimaryButton } from "../components/buttons/PrimaryButton"
import Header from "../components/Header"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState("")
  const { email } = route.params

  useCustomBackHandler("goBack")

  const handleVerifyOTP = () => {
    // Here you would typically verify the OTP with your backend
    console.log("Verifying OTP for:", email)
    navigation.navigate("NewPassword", { email, otp })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Verify OTP" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.card}>
          <Icon name="shield-check-outline" size={scale(48)} color={colors.primary} style={styles.icon} />
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>We have sent a verification code to your email address:</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 6-digit code"
              placeholderTextColor={colors.input.placeholder}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
          <Text style={styles.resendText}>
            Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
          </Text>
          <PrimaryButton title="Verify" onPress={handleVerifyOTP} style={styles.button} disabled={otp.length !== 6} />
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
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.input.border,
    marginBottom: verticalScale(16),
    minHeight: verticalScale(48),
    paddingHorizontal: scale(16),
  },
  input: {
    flex: 1,
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.primary,
    textAlign: "center",
    letterSpacing: scale(4),
  },
  resendText: {
    ...colors.typography.caption,
    fontSize: moderateScale(14),
    color: colors.text.secondary,
    marginBottom: verticalScale(24),
    textAlign: "center",
  },
  resendLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: colors.button.primary,
    height: verticalScale(48),
    width: "100%",
  },
})

export default OTPScreen

