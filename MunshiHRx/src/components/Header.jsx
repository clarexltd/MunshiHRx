import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"

const Header = ({ title, leftIcon, rightIcon, onLeftPress, onRightPress, showBack }) => {
  // If title is an email, truncate it appropriately
  const displayTitle = title.includes("@") ? (title.length > 25 ? title.substring(0, 25) + "..." : title) : title

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.iconButton} onPress={onLeftPress} disabled={!leftIcon && !showBack}>
          {showBack && <Icon name="arrow-left" size={scale(22)} color={colors.text.light} />}
          {leftIcon && <Icon name={leftIcon} size={scale(22)} color={colors.text.light} />}
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.title}>
          {displayTitle}
        </Text>

        <TouchableOpacity style={styles.iconButton} onPress={onRightPress} disabled={!rightIcon}>
          {rightIcon && <Icon name={rightIcon} size={scale(22)} color={colors.text.light} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: verticalScale(8),
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

