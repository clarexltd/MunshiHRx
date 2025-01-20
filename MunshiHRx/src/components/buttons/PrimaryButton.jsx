import React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../../styles/colors"
import { scale, verticalScale, moderateScale } from "../../utils/responsive"

export const PrimaryButton = ({ onPress, title, loading = false, disabled = false, style, icon = "arrow-right" }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.light} />
      ) : (
        <>
          <Text style={styles.text}>{title}</Text>
          {icon && <Icon name={icon} size={scale(20)} color={colors.text.light} style={styles.icon} />}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: verticalScale(48),
    borderRadius: scale(12),
    backgroundColor: colors.button.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(8),
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    ...colors.typography.button,
    fontSize: moderateScale(16),
    color: colors.text.light,
    marginRight: scale(8),
  },
  icon: {
    marginLeft: scale(4),
  },
})

