import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "../../styles/colors"
import { scale, moderateScale } from "../../utils/responsive"

export const SecondaryButton = ({ onPress, title, icon, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {icon && <Ionicons name={icon} size={scale(20)} color={colors.text.secondary} style={styles.icon} />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: scale(12),
    borderRadius: scale(8),
  },
  text: {
    ...colors.typography.button,
    color: colors.text.secondary,
    marginLeft: scale(8),
  },
  icon: {
    opacity: 0.9,
  },
})

