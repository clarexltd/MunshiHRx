import React, { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, SafeAreaView } from "react-native"
import { colors } from "../styles/colors"
import HexagonLogo from "../components/icons/HexagonLogo"
import { scale, verticalScale, moderateScale } from "../utils/responsive"

const SplashScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0)).current
  const logoRotate = useRef(new Animated.Value(0)).current
  const textOpacity = useRef(new Animated.Value(0)).current
  const subtitleOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
        delay: 300,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        delay: 300,
      }),
    ]).start()

    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 800,
    }).start()

    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 1200,
    }).start()

    const timer = setTimeout(() => {
      navigation.replace("Login")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }, { rotate: spin }],
            },
          ]}
        >
          <HexagonLogo size={scale(80)} color={colors.text.light} />
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            {
              opacity: textOpacity,
              transform: [
                {
                  translateY: textOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [moderateScale(20), 0],
                  }),
                },
              ],
            },
          ]}
        >
          CLAREx
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleOpacity,
              transform: [
                {
                  translateY: subtitleOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [moderateScale(20), 0],
                  }),
                },
              ],
            },
          ]}
        >
          Welcome to the Munshi HR Solution
        </Animated.Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  logoContainer: {
    width: scale(80),
    height: scale(80),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  title: {
    ...colors.typography.header,
    fontSize: moderateScale(32),
    color: colors.text.light,
    marginBottom: verticalScale(16),
    letterSpacing: scale(1),
  },
  subtitle: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.light,
    opacity: 0.9,
    textAlign: "center",
    paddingHorizontal: scale(32),
  },
})

export default SplashScreen

