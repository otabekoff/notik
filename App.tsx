// App.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
  Alert,
  AppState,
  LogBox,
  Dimensions,
  ScrollView,
  AppStateStatus,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons, type IoniconsIconName } from '@react-native-vector-icons/ionicons';

const { width, height } = Dimensions.get('window');

// Persistent logging utility that survives crashes
class PersistentLogger {
  private static logs: string[] = [];
  private static maxLogs = 1000;

  static log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] LOG: ${message} ${
      data ? JSON.stringify(data) : ''
    }`;
    console.log(logEntry);
    this.addToBuffer(logEntry);
  }

  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    const errorMsg =
      error?.message || error?.toString() || JSON.stringify(error) || '';
    const logEntry = `[${timestamp}] ERROR: ${message} ${errorMsg}`;
    console.error(logEntry);
    this.addToBuffer(logEntry);

    // Also log stack trace if available
    if (error?.stack) {
      const stackEntry = `[${timestamp}] STACK: ${error.stack}`;
      console.error(stackEntry);
      this.addToBuffer(stackEntry);
    }
  }

  static warn(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] WARN: ${message} ${
      data ? JSON.stringify(data) : ''
    }`;
    console.warn(logEntry);
    this.addToBuffer(logEntry);
  }

  static info(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] INFO: ${message} ${
      data ? JSON.stringify(data) : ''
    }`;
    console.info(logEntry);
    this.addToBuffer(logEntry);
  }

  private static addToBuffer(logEntry: string) {
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  static getLogs(): string[] {
    return [...this.logs];
  }

  static getRecentLogs(count = 50): string[] {
    return this.logs.slice(-count);
  }

  static clearLogs() {
    this.logs = [];
    this.info('Logs cleared');
  }

  static exportLogs(): string {
    return this.logs.join('\n');
  }
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    PersistentLogger.error('ErrorBoundary caught an error', error);
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    PersistentLogger.error('ErrorBoundary componentDidCatch', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <ScrollView style={styles.logContainer}>
            <Text style={styles.logText}>
              Recent Logs:
              {'\n'}
              {PersistentLogger.getRecentLogs(10).join('\n')}
            </Text>
          </ScrollView>
          <View style={styles.errorButtons}>
            <Pressable
              style={[styles.errorButton, { backgroundColor: '#2196F3' }]}
              onPress={() => {
                Alert.alert(
                  'Logs',
                  PersistentLogger.getRecentLogs(20).join('\n'),
                );
              }}
            >
              <Text style={styles.errorButtonText}>View Logs</Text>
            </Pressable>
            <Pressable
              style={styles.errorButton}
              onPress={() => {
                this.setState({
                  hasError: false,
                  error: null,
                  errorInfo: null,
                });
              }}
            >
              <Text style={styles.errorButtonText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Custom Tab Navigation Component
interface CustomTabNavigatorProps {
  isDarkMode: boolean;
}

function CustomTabNavigator({ isDarkMode }: CustomTabNavigatorProps) {
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

  return (
    <ErrorBoundary
      fallback={error => (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Navigation Error</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
    >
      <View style={styles.container}>
        {/* Content Area */}
        <View style={styles.contentContainer}>
          {activeTab === 'Home' ? (
            <HomeScreen isDarkMode={isDarkMode} />
          ) : (
            <SettingsScreen isDarkMode={isDarkMode} />
          )}
        </View>

        {/* Custom Tab Bar */}
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <Pressable
            style={[
              styles.tabItem,
              activeTab === 'Home' && styles.activeTabItem,
            ]}
            onPress={() => handleTabPress('Home')}
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
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    activeTab === 'Home'
                      ? isDarkMode
                        ? '#ffffff'
                        : '#007AFF'
                      : isDarkMode
                      ? '#666666'
                      : '#999999',
                },
              ]}
            >
              Home
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabItem,
              activeTab === 'Settings' && styles.activeTabItem,
            ]}
            onPress={() => handleTabPress('Settings')}
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
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    activeTab === 'Settings'
                      ? isDarkMode
                        ? '#ffffff'
                        : '#007AFF'
                      : isDarkMode
                      ? '#666666'
                      : '#999999',
                },
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

function HomeScreen({ isDarkMode }: { isDarkMode: boolean }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    PersistentLogger.info('HomeScreen rendered', { isDarkMode });
    return () => {
      PersistentLogger.info('HomeScreen unmounted');
    };
  }, [isDarkMode]);

  return (
    <ErrorBoundary
      fallback={error => (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Home Screen Error</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
    >
      <View
        style={[
          styles.screenContainer,
          isDarkMode ? styles.darkBg : styles.lightBg,
          { paddingTop: insets.top + 20 },
        ]}
      >
        <Text
          style={[
            styles.screenTitle,
            { color: isDarkMode ? '#ffffff' : '#000000' },
          ]}
        >
          Hello, world!
        </Text>

        <View
          style={[
            styles.debugContainer,
            {
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
            },
          ]}
        >
          <Text
            style={[styles.debugTitle, { color: isDarkMode ? '#ccc' : '#666' }]}
          >
            Debug Info:
          </Text>
          <Text
            style={[styles.debugText, { color: isDarkMode ? '#ccc' : '#666' }]}
          >
            Dark Mode: {isDarkMode ? 'ON' : 'OFF'}
          </Text>
          <Text
            style={[styles.debugText, { color: isDarkMode ? '#ccc' : '#666' }]}
          >
            Platform: {Platform.OS}
          </Text>
          <Text
            style={[styles.debugText, { color: isDarkMode ? '#ccc' : '#666' }]}
          >
            Screen: {width}x{height}
          </Text>
          <Text
            style={[styles.debugText, { color: isDarkMode ? '#ccc' : '#666' }]}
          >
            Safe Area Top: {insets.top}
          </Text>
        </View>

        <Pressable
          style={[
            styles.logButton,
            { backgroundColor: isDarkMode ? '#333' : '#ddd' },
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
              styles.logButtonText,
              { color: isDarkMode ? '#fff' : '#000' },
            ]}
          >
            View Recent Logs
          </Text>
        </Pressable>
      </View>
    </ErrorBoundary>
  );
}

function SettingsScreen({ isDarkMode }: { isDarkMode: boolean }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    PersistentLogger.info('SettingsScreen rendered', { isDarkMode });
    return () => {
      PersistentLogger.info('SettingsScreen unmounted');
    };
  }, [isDarkMode]);

  return (
    <ErrorBoundary
      fallback={error => (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Settings Screen Error</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
    >
      <View
        style={[
          styles.screenContainer,
          isDarkMode ? styles.darkBg : styles.lightBg,
          styles.centerContent,
          { paddingTop: insets.top + 20 },
        ]}
      >
        <Text
          style={[
            styles.screenTitle,
            { color: isDarkMode ? '#ffffff' : '#000000' },
          ]}
        >
          Settings Page
        </Text>

        <View
          style={[
            styles.debugContainer,
            {
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
            },
          ]}
        >
          <Text
            style={[styles.debugTitle, { color: isDarkMode ? '#ccc' : '#666' }]}
          >
            Settings Info:
          </Text>
          <Text
            style={[styles.debugText, { color: isDarkMode ? '#ccc' : '#666' }]}
          >
            Theme: {isDarkMode ? 'Dark' : 'Light'}
          </Text>
          <Text
            style={[styles.debugText, { color: isDarkMode ? '#ccc' : '#666' }]}
          >
            Logs Count: {PersistentLogger.getLogs().length}
          </Text>
        </View>

        <View style={styles.settingsButtons}>
          <Pressable
            style={[
              styles.logButton,
              { backgroundColor: isDarkMode ? '#333' : '#ddd' },
            ]}
            onPress={() => {
              Alert.alert('All Logs', PersistentLogger.exportLogs());
            }}
          >
            <Text
              style={[
                styles.logButtonText,
                { color: isDarkMode ? '#fff' : '#000' },
              ]}
            >
              Export All Logs
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.logButton,
              { backgroundColor: '#f44336', marginTop: 10 },
            ]}
            onPress={() => {
              PersistentLogger.clearLogs();
              Alert.alert('Success', 'Logs cleared');
            }}
          >
            <Text style={[styles.logButtonText, { color: '#fff' }]}>
              Clear Logs
            </Text>
          </Pressable>
        </View>
      </View>
    </ErrorBoundary>
  );
}

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
      <SafeAreaProvider style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
        />

        <CustomTabNavigator isDarkMode={isDarkMode} />

        {/* Theme Toggle Button */}
        <View
          style={[
            styles.switchContainer,
            {
              backgroundColor: isDarkMode
                ? 'rgba(26,26,26,0.9)'
                : 'rgba(240,240,240,0.9)',
            },
          ]}
        >
          <Pressable
            onPress={handleThemeToggle}
            style={({ pressed }) => [
              styles.switchButton,
              {
                backgroundColor: isDarkMode ? '#333' : '#ddd',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.switchText,
                { color: isDarkMode ? '#fff' : '#000' },
              ]}
            >
              Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
            </Text>
          </Pressable>
        </View>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  darkBg: {
    backgroundColor: '#000',
  },
  lightBg: {
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    marginVertical: 2,
  },
  logButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsButtons: {
    marginTop: 20,
  },
  // Custom Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTabItem: {
    // Add any active state styling here
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Theme Toggle Styles
  switchContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  switchButton: {
    padding: 15,
    borderRadius: 20,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffebee',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  errorButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logContainer: {
    maxHeight: 200,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  logText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#333',
  },
});

export default App;