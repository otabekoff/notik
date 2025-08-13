import React, { useState, useEffect } from 'react';
import {
  Platform,
  StatusBar,
  useColorScheme,
  Alert,
  AppState,
  LogBox,
  AppStateStatus,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { CustomTabNavigator } from './src/layouts/CustomTabNavigator';
import { ThemeToggle } from './src/components/ThemeToggle';
import { PersistentLogger } from './src/utils/PersistentLogger';
import { globalStyles } from './src/styles/globalStyles';

function App() {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState as AppStateStatus,
  );

  // Global error handler
  useEffect(() => {
    PersistentLogger.info('App component mounted');
    PersistentLogger.info('Initial system scheme', { systemScheme });
    PersistentLogger.info('Initial dark mode', { isDarkMode });

    // Suppress warnings for cleaner logs
    if (__DEV__) {
      LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
        'Require cycle:',
        'Warning: componentWillReceiveProps has been renamed',
        'Warning: componentWillMount has been renamed',
        'VirtualizedLists should never be nested',
        'Setting a timer for a long period of time',
      ]);
    }

    // Global error handler for React Native 0.81
    const setupGlobalErrorHandler = () => {
      try {
        const originalHandler = ErrorUtils.getGlobalHandler();

        ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
          PersistentLogger.error('Global error caught', {
            error: error?.message || error?.toString() || 'Unknown error',
            isFatal,
            stack: error?.stack,
          });

          if (isFatal) {
            Alert.alert(
              'Fatal Error',
              `Fatal error occurred: ${
                error?.message || 'Unknown error'
              }\n\nLogs preserved for debugging.`,
              [
                {
                  text: 'View Logs',
                  onPress: () => {
                    Alert.alert(
                      'Error Logs',
                      PersistentLogger.getRecentLogs(15).join('\n'),
                    );
                  },
                },
                { text: 'OK' },
              ],
            );
          }

          // Call the original handler
          originalHandler?.(error, isFatal);
        });

        PersistentLogger.info('Global error handler set up successfully');
      } catch (error) {
        PersistentLogger.error('Failed to set up global error handler', error);
      }
    };

    setupGlobalErrorHandler();

    // App state change handler
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      PersistentLogger.info('App state changed', {
        from: appState,
        to: nextAppState,
      });
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      PersistentLogger.info('App component unmounting');
      subscription?.remove();
    };
  }, [appState]);

  // System navigation bar effect
  useEffect(() => {
    const updateSystemNavigation = async () => {
      try {
        if (Platform.OS === 'android') {
          PersistentLogger.info('Updating system navigation bar', {
            isDarkMode,
          });
          const navColor = isDarkMode ? '#000000' : '#ffffff';
          const iconStyle = isDarkMode ? 'light' : 'dark';

          await SystemNavigationBar.setNavigationColor(
            navColor,
            iconStyle,
            'navigation',
          );
          PersistentLogger.info('System navigation bar updated successfully');
        }
      } catch (error) {
        PersistentLogger.error('Failed to update system navigation bar', error);
      }
    };

    updateSystemNavigation();
  }, [isDarkMode]);

  // Theme toggle handler
  const handleThemeToggle = () => {
    try {
      PersistentLogger.info('Theme toggle pressed', {
        currentMode: isDarkMode,
      });
      setIsDarkMode(prev => {
        const newMode = !prev;
        PersistentLogger.info('Theme changed successfully', { newMode });
        return newMode;
      });
    } catch (error) {
      PersistentLogger.error('Error toggling theme', error);
      Alert.alert('Error', 'Failed to change theme. Please try again.');
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaProvider style={globalStyles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
        />

        <CustomTabNavigator isDarkMode={isDarkMode} />

        <ThemeToggle isDarkMode={isDarkMode} onToggle={handleThemeToggle} />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
