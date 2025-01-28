import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Header = ({ title, leftIcon, rightIcon, onLeftPress, onRightPress, showBack }) => {
  const insets = useSafeAreaInsets()
  const displayTitle = title.includes("@") ? (title.length > 25 ? title.substring(0, 25) + "..." : title) : title

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent />
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.iconButton} onPress={onLeftPress} disabled={!leftIcon && !showBack}>
          {showBack && <Ionicons name="arrow-back" size={scale(22)} color={colors.text.light} />}
          {leftIcon && <Ionicons name={leftIcon} size={scale(22)} color={colors.text.light} />}
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.title}>
          {displayTitle}
        </Text>

        <TouchableOpacity style={styles.iconButton} onPress={onRightPress} disabled={!rightIcon}>
          {rightIcon && <Ionicons name={rightIcon} size={scale(22)} color={colors.text.light} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingBottom: verticalScale(16),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  headerContent: {
    height: verticalScale(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
  },
  title: {
    ...colors.typography.header,
    fontSize: moderateScale(16),
    color: colors.text.light,
    flex: 1,
    textAlign: "center",
    marginHorizontal: scale(8),
  },
  iconButton: {
    width: scale(40),
    height: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
})

export default Header

