import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"

const CustomAlert = ({ visible, title, message, onClose, onConfirm }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Icon name="alert-circle-outline" size={scale(48)} color={colors.primary} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Text style={[styles.buttonText, styles.confirmButtonText]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: colors.card.background,
    borderRadius: scale(16),
    padding: scale(24),
    alignItems: "center",
    width: "80%",
    maxWidth: 400,
  },
  icon: {
    marginBottom: verticalScale(16),
  },
  title: {
    ...colors.typography.header,
    fontSize: moderateScale(20),
    color: colors.text.primary,
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  message: {
    ...colors.typography.body,
    fontSize: moderateScale(14),
    color: colors.text.secondary,
    marginBottom: verticalScale(24),
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.background,
    marginRight: scale(8),
  },
  confirmButton: {
    backgroundColor: colors.primary,
    marginLeft: scale(8),
  },
  buttonText: {
    ...colors.typography.button,
    fontSize: moderateScale(14),
  },
  confirmButtonText: {
    color: colors.text.light,
  },
})

export default CustomAlert

