// src/components/buttons/SecondaryButton.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles/colors';

export const SecondaryButton = ({
  onPress,
  title,
  icon,
  style,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {icon && (
        <Icon 
          name={icon} 
          size={20} 
          color={colors.text.secondary} 
          style={styles.icon} 
        />
      )}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  text: {
    ...colors.typography.button,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  icon: {
    opacity: 0.9,
  },
});

