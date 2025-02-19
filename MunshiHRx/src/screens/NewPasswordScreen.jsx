import React, { useState } from "react"
import { View, Text, StyleSheet, TextInput, SafeAreaView, Alert } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { PrimaryButton } from "../components/buttons/PrimaryButton"
import Header from "../components/Header"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"
import { resetPassword } from "../services/api"

const NewPasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { email, otp } = route.params

  useCustomBackHandler("goBack")

  const handleSetNewPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match")
      return
    }

    setLoading(true)
    try {
      await resetPassword(email, password, otp)
      Alert.alert("Success", "Your password has been reset successfully", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ])
    } catch (error) {
      Alert.alert("Error", error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Set New Password" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={scale(18)} color={colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              placeholderTextColor={colors.input.placeholder}
              secureTextEntry
            />
          </View>

          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={scale(18)} color={colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={colors.input.placeholder}
              secureTextEntry
            />
          </View>

          <PrimaryButton
            title="Set New Password"
            onPress={handleSetNewPassword}
            style={styles.button}
            loading={loading}
            disabled={!password || !confirmPassword}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.input.border,
    marginBottom: verticalScale(16),
    minHeight: verticalScale(48),
    paddingVertical: verticalScale(2),
  },
  inputIcon: {
    marginLeft: scale(12),
    marginRight: scale(8),
    alignSelf: "center",
  },
  input: {
    flex: 1,
    ...colors.typography.body,
    fontSize: moderateScale(13),
    color: colors.text.primary,
    paddingVertical: verticalScale(8),
    minHeight: verticalScale(48),
    textAlignVertical: "center",
  },
  button: {
    backgroundColor: colors.button.primary,
    height: verticalScale(48),
    marginTop: verticalScale(8),
  },
})

export default NewPasswordScreen

