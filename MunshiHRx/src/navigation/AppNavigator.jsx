import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import PasswordScreen from "../screens/PasswordScreen"
import SetPasswordScreen from "../screens/SetPasswordScreen"
import OTPScreen from "../screens/OTPScreen"
import HomeScreen from "../screens/HomeScreen"
import { colors } from "../styles/colors"

const Stack = createStackNavigator()

const AppNavigator = () => {
  const [isInitializing, setIsInitializing] = useState(true)
  const [userToken, setUserToken] = useState(null)

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token
      try {
        token = await AsyncStorage.getItem("userToken")
      } catch (e) {
        // Restoring token failed
      }
      setUserToken(token)
    }

    bootstrapAsync()
  }, [])

  const handleSplashFinish = () => {
    setIsInitializing(false)
  }

  if (isInitializing) {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userToken ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Password" component={PasswordScreen} />
        <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

