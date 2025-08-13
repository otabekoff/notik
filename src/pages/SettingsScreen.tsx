import React, { useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PersistentLogger } from '../utils/PersistentLogger';
import { screenStyles } from '../styles/screenStyles';
import { globalStyles } from '../styles/globalStyles';

interface SettingsScreenProps {
  isDarkMode: boolean;
}

function SettingsScreenErrorFallback(error: Error, _errorInfo: React.ErrorInfo) {
  return (
    <View style={globalStyles.errorContainer}>
      <Text style={globalStyles.errorTitle}>Settings Screen Error</Text>
      <Text style={globalStyles.errorText}>{error.message}</Text>
    </View>
  );
}

export function SettingsScreen({ isDarkMode }: SettingsScreenProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    PersistentLogger.info('SettingsScreen rendered', { isDarkMode });
    return () => {
      PersistentLogger.info('SettingsScreen unmounted');
    };
  }, [isDarkMode]);

  return (
    <ErrorBoundary fallback={SettingsScreenErrorFallback}>
      <View
        style={[
          screenStyles.screenContainer,
          isDarkMode ? screenStyles.darkBg : screenStyles.lightBg,
          screenStyles.centerContent,
          { paddingTop: insets.top + 20 },
        ]}
      >
        <Text
          style={[
            screenStyles.screenTitle,
            isDarkMode ? globalStyles.darkText : globalStyles.lightText,
          ]}
        >
          Settings Page
        </Text>

        <View
          style={[
            screenStyles.debugContainer,
            isDarkMode ? globalStyles.debugContainerBgDark : globalStyles.debugContainerBgLight,
          ]}
        >
          <Text
            style={[
              screenStyles.debugTitle,
              isDarkMode ? globalStyles.debugTitleDark : globalStyles.debugTitleLight,
            ]}
          >
            Settings Info:
          </Text>
          <Text
            style={[
              screenStyles.debugText,
              isDarkMode ? globalStyles.debugTextDark : globalStyles.debugTextLight,
            ]}
          >
            Theme: {isDarkMode ? 'Dark' : 'Light'}
          </Text>
          <Text
            style={[
              screenStyles.debugText,
              isDarkMode ? globalStyles.debugTextDark : globalStyles.debugTextLight,
            ]}
          >
            Logs Count: {PersistentLogger.getLogs().length}
          </Text>
        </View>

        <View style={screenStyles.settingsButtons}>
          <Pressable
            style={[
              screenStyles.logButton,
              isDarkMode ? globalStyles.logButtonBgDark : globalStyles.logButtonBgLight,
            ]}
            onPress={() => {
              Alert.alert('All Logs', PersistentLogger.exportLogs());
            }}
          >
            <Text
              style={[
                screenStyles.logButtonText,
                isDarkMode ? globalStyles.logButtonTextDark : globalStyles.logButtonTextLight,
              ]}
            >
              Export All Logs
            </Text>
          </Pressable>

          <Pressable
            style={[
              screenStyles.logButton,
              globalStyles.errorButton,
              screenStyles.marginTop10,
            ]}
            onPress={() => {
              PersistentLogger.clearLogs();
              Alert.alert('Success', 'Logs cleared');
            }}
          >
            <Text style={[screenStyles.logButtonText, globalStyles.errorButtonText]}>
              Clear Logs
            </Text>
          </Pressable>
        </View>
      </View>
    </ErrorBoundary>
  );
}