import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import PasswordScreen from "../screens/PasswordScreen"
import HomeScreen from "../screens/HomeScreen"
import OTPScreen from "../screens/OTPScreen"
import NewPasswordScreen from "../screens/NewPasswordScreen"
import { colors } from "../styles/colors"

const Stack = createStackNavigator()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          gestureEnabled: false, // Disable gesture navigation for all screens
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Password" component={PasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

