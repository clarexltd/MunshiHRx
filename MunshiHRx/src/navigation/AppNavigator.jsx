import React, { useState, useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import PasswordScreen from "../screens/PasswordScreen"
import SetPasswordScreen from "../screens/SetPasswordScreen"
import OTPScreen from "../screens/OTPScreen"
import HomeScreen from "../screens/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import { colors } from "../styles/colors"
import { scale, moderateScale } from "../utils/responsive"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <TouchableOpacity key={index} onPress={onPress} style={[styles.tabItem, isFocused && styles.tabItemFocused]}>
            <Ionicons
              name={options.tabBarIcon({ focused: isFocused, color: "", size: 24 })}
              size={24}
              color={isFocused ? colors.primary : colors.text.secondary}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>{label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline"
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline"
        }

        return iconName
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
  </Tab.Navigator>
)

const AppNavigator = ({ isAuthenticated }) => {
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Main" : "Login"}
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
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.card.border,
    paddingBottom: scale(8),
    paddingTop: scale(12),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemFocused: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    paddingTop: scale(10),
  },
  tabLabel: {
    ...colors.typography.caption,
    fontSize: moderateScale(12),
    color: colors.text.secondary,
    marginTop: scale(4),
  },
  tabLabelFocused: {
    color: colors.primary,
  },
})

export default AppNavigator

