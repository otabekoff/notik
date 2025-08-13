import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <View
      style={[
        globalStyles.switchContainer,
        isDarkMode ? globalStyles.switchBgDark : globalStyles.switchBgLight,
      ]}
    >
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          globalStyles.switchButton,
          isDarkMode ? globalStyles.switchButtonBgDark : globalStyles.switchButtonBgLight,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text
          style={[
            globalStyles.switchText,
            isDarkMode ? globalStyles.switchTextDark : globalStyles.switchTextLight,
          ]}
        >
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </Text>
      </Pressable>
    </View>
  );
}