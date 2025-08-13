import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  // Removed unused SafeAreaView import
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
// Removed unused LinearGradient import

import { Ionicons } from '@react-native-vector-icons/ionicons';
import DangerZone from '../components/DangerZone';
import Preferences from '../components/Preferences';
import ProgressStats from '../components/ProgressStats';
import useTheme from '../hooks/useTheme';
import { createSettingsStyles } from '../styles/settings.styles';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const settingsStyles = createSettingsStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={settingsStyles.container}>
      {/* HEADER */}
      <View style={[settingsStyles.header, { paddingTop: insets.top + 20 }]}>
        {/* Match TodoScreen top padding */}
        <View style={settingsStyles.titleContainer}>
          <View
            style={[
              settingsStyles.iconContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="settings" size={28} color="#ffffff" />
          </View>
          <Text style={settingsStyles.title}>Settings</Text>
        </View>
      </View>
      <ScrollView
        style={settingsStyles.scrollView}
        contentContainerStyle={settingsStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProgressStats />
        <Preferences />
        <DangerZone />
      </ScrollView>
    </View>
  );
};
export default SettingsScreen;
