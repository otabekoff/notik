import React, { useEffect } from 'react';
import { View, Text, Pressable, Alert, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PersistentLogger } from '../utils/PersistentLogger';
import { screenStyles } from '../styles/screenStyles';
import { globalStyles } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

interface TodoScreenProps {
  isDarkMode: boolean;
}

function TodoScreenErrorFallback(error: Error, errorInfo: React.ErrorInfo) {
  return (
    <View style={globalStyles.errorContainer}>
      <Text style={globalStyles.errorTitle}>Todo Screen Error</Text>
      <Text style={globalStyles.errorText}>{error.message}</Text>
      <Text style={globalStyles.errorText}>{errorInfo.componentStack}</Text>
    </View>
  );
}

export function TodoScreen({ isDarkMode }: TodoScreenProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    PersistentLogger.info('TodoScreen rendered', { isDarkMode });
    return () => {
      PersistentLogger.info('TodoScreen unmounted');
    };
  }, [isDarkMode]);

  return (
    <ErrorBoundary fallback={TodoScreenErrorFallback}>
      <View
        style={[
          screenStyles.screenContainer,
          isDarkMode ? screenStyles.darkBg : screenStyles.lightBg,
          { paddingTop: insets.top + 20 },
        ]}
      >
        <Text
          style={[
            screenStyles.screenTitle,
            isDarkMode ? globalStyles.lightText : globalStyles.darkText,
          ]}
        >
          Hello, world!
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
            Debug Info:
          </Text>
          <Text
            style={[
              screenStyles.debugText,
              isDarkMode ? globalStyles.debugTextDark : globalStyles.debugTextLight,
            ]}
          >
            Dark Mode: {isDarkMode ? 'ON' : 'OFF'}
          </Text>
          <Text
            style={[
              screenStyles.debugText,
              isDarkMode ? globalStyles.debugTextDark : globalStyles.debugTextLight,
            ]}
          >
            Platform: {Platform.OS}
          </Text>
          <Text
            style={[
              screenStyles.debugText,
              isDarkMode ? globalStyles.debugTextDark : globalStyles.debugTextLight,
            ]}
          >
            Screen: {width}x{height}
          </Text>
          <Text
            style={[
              screenStyles.debugText,
              isDarkMode ? globalStyles.debugTextDark : globalStyles.debugTextLight,
            ]}
          >
            Safe Area Top: {insets.top}
          </Text>
        </View>

        <Pressable
          style={[
            screenStyles.logButton,
            isDarkMode ? globalStyles.logButtonBgDark : globalStyles.logButtonBgLight,
          ]}
          onPress={() => {
            Alert.alert(
              'Recent Logs',
              PersistentLogger.getRecentLogs(10).join('\n'),
            );
          }}
        >
          <Text
            style={[
              screenStyles.logButtonText,
              isDarkMode ? globalStyles.logButtonTextDark : globalStyles.logButtonTextLight,
            ]}
          >
            View Recent Logs
          </Text>
        </Pressable>
      </View>
    </ErrorBoundary>
  );
}
