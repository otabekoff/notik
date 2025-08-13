import React, { useState } from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, type IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { HomeScreen } from '../pages/HomeScreen';
import { SettingsScreen } from '../pages/SettingsScreen';
import { PersistentLogger } from '../utils/PersistentLogger';
import { tabBarStyles } from '../styles/tabBarStyles';
import { globalStyles } from '../styles/globalStyles';

interface CustomTabNavigatorProps {
  isDarkMode: boolean;
}

import type { ErrorInfo } from 'react';

function NavigationErrorFallback(error: Error, _errorInfo: ErrorInfo) {
  return (
    <View style={globalStyles.errorContainer}>
      <Text style={globalStyles.errorTitle}>Navigation Error</Text>
      <Text style={globalStyles.errorText}>{error.message}</Text>
    </View>
  );
}

export function CustomTabNavigator({ isDarkMode }: CustomTabNavigatorProps) {
  const [activeTab, setActiveTab] = useState<'Home' | 'Settings'>('Home');
  const insets = useSafeAreaInsets();

  const handleTabPress = (tabName: 'Home' | 'Settings') => {
    try {
      PersistentLogger.info(`Tab pressed: ${tabName}`, {
        from: activeTab,
        to: tabName,
      });
      setActiveTab(tabName);
      PersistentLogger.info(`Tab changed successfully to: ${tabName}`);
    } catch (error) {
      PersistentLogger.error(`Error changing tab to ${tabName}`, error);
    }
  };

  // Define icon names for each tab
  const getIconName = (tabName: 'Home' | 'Settings', isActive: boolean): IoniconsIconName => {
    if (tabName === 'Home') {
      return isActive ? 'home' : 'home-outline';
    } else {
      return isActive ? 'settings' : 'settings-outline';
    }
  };

  // Create ripple config for Android
  const getRippleConfig = (isDark: boolean) => ({
    color:
      isDark
        ? 'rgba(255,255,255,0.3)'
        : 'rgba(0,0,0,0.2)',
    borderless: false,
    // radius: 24,
    foreground: true,
  });

  return (
    <ErrorBoundary
      fallback={NavigationErrorFallback}
    >
      <View style={globalStyles.container}>
        {/* Content Area */}
        <View style={globalStyles.contentContainer}>
          {activeTab === 'Home' ? (
            <HomeScreen isDarkMode={isDarkMode} />
          ) : (
            <SettingsScreen isDarkMode={isDarkMode} />
          )}
        </View>

        {/* Custom Tab Bar */}
        <View
          style={[
            tabBarStyles.tabBar,
            isDarkMode ? tabBarStyles.tabBarBgDark : tabBarStyles.tabBarBgLight,
            { paddingBottom: insets.bottom },
          ]}
        >
          <Pressable
            style={[
              tabBarStyles.tabItem,
              activeTab === 'Home' && tabBarStyles.activeTabItem,
            ]}
            onPress={() => handleTabPress('Home')}
            android_ripple={Platform.OS === 'android' ? getRippleConfig(isDarkMode) : undefined}
          >
            <Ionicons
              name={getIconName('Home', activeTab === 'Home')}
              size={24}
              color={
                activeTab === 'Home'
                  ? isDarkMode
                    ? '#ffffff'
                    : '#007AFF'
                  : isDarkMode
                  ? '#666666'
                  : '#999999'
              }
              style={tabBarStyles.tabIcon}
            />
            <Text
              style={[
                tabBarStyles.tabLabel,
                activeTab === 'Home'
                  ? isDarkMode
                    ? tabBarStyles.tabLabelActiveDark
                    : tabBarStyles.tabLabelActiveLight
                  : isDarkMode
                  ? tabBarStyles.tabLabelInactiveDark
                  : tabBarStyles.tabLabelInactiveLight,
              ]}
            >
              Home
            </Text>
          </Pressable>

          <Pressable
            style={[
              tabBarStyles.tabItem,
              activeTab === 'Settings' && tabBarStyles.activeTabItem,
            ]}
            onPress={() => handleTabPress('Settings')}
            android_ripple={Platform.OS === 'android' ? getRippleConfig(isDarkMode) : undefined}
          >
            <Ionicons
              name={getIconName('Settings', activeTab === 'Settings')}
              size={24}
              color={
                activeTab === 'Settings'
                  ? isDarkMode
                    ? '#ffffff'
                    : '#007AFF'
                  : isDarkMode
                  ? '#666666'
                  : '#999999'
              }
              style={tabBarStyles.tabIcon}
            />
            <Text
              style={[
                tabBarStyles.tabLabel,
                activeTab === 'Settings'
                  ? isDarkMode
                    ? tabBarStyles.tabLabelActiveDark
                    : tabBarStyles.tabLabelActiveLight
                  : isDarkMode
                  ? tabBarStyles.tabLabelInactiveDark
                  : tabBarStyles.tabLabelInactiveLight,
              ]}
            >
              Settings
            </Text>
          </Pressable>
        </View>
      </View>
    </ErrorBoundary>
  );
}