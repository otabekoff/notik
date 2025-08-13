import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import { Animated } from 'react-native';
// Removed duplicate import
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, type IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { ErrorBoundary } from '../components/ErrorBoundary';
import TodoScreen from '../pages/TodoScreen';
import SettingsScreen from '../pages/SettingsScreen';
import { PersistentLogger } from '../utils/PersistentLogger';
import { tabBarStyles } from '../styles/tabBarStyles';
import { globalStyles } from '../styles/globalStyles';


import type { ErrorInfo } from 'react';

function NavigationErrorFallback(error: Error, _errorInfo: ErrorInfo) {
  return (
    <View style={globalStyles.errorContainer}>
      <Text style={globalStyles.errorTitle}>Navigation Error</Text>
      <Text style={globalStyles.errorText}>{error.message}</Text>
    </View>
  );
}

import useTheme from '../hooks/useTheme';

export function CustomTabNavigator() {
  const [activeTab, setActiveTab] = useState<'Todo' | 'Settings'>('Todo');
  const [prevTab, setPrevTab] = useState<'Todo' | 'Settings'>(activeTab);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (activeTab !== prevTab) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setPrevTab(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabPress = (tabName: 'Todo' | 'Settings') => {
    if (tabName !== activeTab) {
      PersistentLogger.info(`Tab pressed: ${tabName}`, {
        from: activeTab,
        to: tabName,
      });
      setActiveTab(tabName);
      PersistentLogger.info(`Tab changed successfully to: ${tabName}`);
    }
  };

  // Define icon names for each tab
  const getIconName = (tabName: 'Todo' | 'Settings', isActive: boolean): IoniconsIconName => {
    if (tabName === 'Todo') {
      return isActive ? 'flash' : 'flash-outline';
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
    foreground: true,
  });

  return (
    <ErrorBoundary fallback={NavigationErrorFallback}>
      <View style={globalStyles.container}>
        {/* Content Area with Fade Transition */}
        <Animated.View style={[globalStyles.contentContainer, { opacity: fadeAnim }]}> 
          {activeTab === 'Todo' ? <TodoScreen /> : <SettingsScreen />}
        </Animated.View>

        {/* Custom Tab Bar */}
        <View
          style={[tabBarStyles.tabBar, isDarkMode ? tabBarStyles.tabBarBgDark : tabBarStyles.tabBarBgLight, { paddingBottom: insets.bottom }]}
        >
          <Pressable
            style={[tabBarStyles.tabItem, activeTab === 'Todo' && tabBarStyles.activeTabItem]}
            onPress={() => handleTabPress('Todo')}
            android_ripple={Platform.OS === 'android' ? getRippleConfig(isDarkMode) : undefined}
          >
            <Ionicons
              name={getIconName('Todo', activeTab === 'Todo')}
              size={24}
              color={activeTab === 'Todo' ? (isDarkMode ? '#ffffff' : '#007AFF') : isDarkMode ? '#666666' : '#999999'}
              style={tabBarStyles.tabIcon}
            />
            <Text
              style={[tabBarStyles.tabLabel, activeTab === 'Todo' ? (isDarkMode ? tabBarStyles.tabLabelActiveDark : tabBarStyles.tabLabelActiveLight) : isDarkMode ? tabBarStyles.tabLabelInactiveDark : tabBarStyles.tabLabelInactiveLight]}
            >
              Todos
            </Text>
          </Pressable>

          <Pressable
            style={[tabBarStyles.tabItem, activeTab === 'Settings' && tabBarStyles.activeTabItem]}
            onPress={() => handleTabPress('Settings')}
            android_ripple={Platform.OS === 'android' ? getRippleConfig(isDarkMode) : undefined}
          >
            <Ionicons
              name={getIconName('Settings', activeTab === 'Settings')}
              size={24}
              color={activeTab === 'Settings' ? (isDarkMode ? '#ffffff' : '#007AFF') : isDarkMode ? '#666666' : '#999999'}
              style={tabBarStyles.tabIcon}
            />
            <Text
              style={[tabBarStyles.tabLabel, activeTab === 'Settings' ? (isDarkMode ? tabBarStyles.tabLabelActiveDark : tabBarStyles.tabLabelActiveLight) : isDarkMode ? tabBarStyles.tabLabelInactiveDark : tabBarStyles.tabLabelInactiveLight]}
            >
              Settings
            </Text>
          </Pressable>
        </View>
      </View>
    </ErrorBoundary>
  );
}