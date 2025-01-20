import React, { useState } from "react"
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { PrimaryButton } from "../components/buttons/PrimaryButton"
import Header from "../components/Header"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useCustomBackHandler } from "../hooks/useCustomBackHandler"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  useCustomBackHandler("exit")

  const handleContinue = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigation.navigate("Password", { email })
    }, 1000)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sign In" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Icon name="shield-account" size={scale(40)} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={scale(18)} color={colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.input.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            disabled={!email.trim()}
            style={styles.button}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.input.border,
    marginBottom: verticalScale(24),
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
  },
})

export default LoginScreen

