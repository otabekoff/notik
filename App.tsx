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
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "@react-native-vector-icons/ionicons";

// Enhanced logging utility
class Logger {
  static log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] LOG: ${message}`, data || '');
  }

  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, error || '');
  }

  static warn(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN: ${message}`, data || '');
  }

  static info(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] INFO: ${message}`, data || '');
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
    Logger.error('ErrorBoundary caught an error', error);
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('ErrorBoundary componentDidCatch', { error, errorInfo });
    this.setState({
      error,
      errorInfo,
    });

    // Show alert to user
    Alert.alert(
      'Application Error',
      'An unexpected error occurred. Please restart the app.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset error boundary
            this.setState({
              hasError: false,
              error: null,
              errorInfo: null,
            });
          },
        },
      ],
    );
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
      );
    }

    return this.props.children;
  }
}

// Safe wrapper for screens
function SafeScreen({
  children,
  screenName,
}: {
  children: ReactNode;
  screenName: string;
}) {
  useEffect(() => {
    Logger.info(`${screenName} mounted`);
    return () => {
      Logger.info(`${screenName} unmounted`);
    };
  }, [screenName]);

  return (
    <ErrorBoundary
      fallback={(error, errorInfo) => (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error in {screenName}</Text>
          <Text style={styles.errorText}>{error.message}</Text>
          <Text style={styles.errorDetails}>{errorInfo.componentStack}</Text>
        </View>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

function HomeScreen({ isDarkMode }: { isDarkMode: boolean }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Logger.info('HomeScreen rendered with isDarkMode:', isDarkMode);
  }, [isDarkMode]);

  try {
    return (
      <SafeScreen screenName="Home">
        <View
          style={[
            styles.container,
            isDarkMode ? styles.darkBg : styles.lightBg,
            { paddingTop: insets.top },
          ]}
        >
          <Text
            style={{
              color: isDarkMode
                ? styles.textLight.color
                : styles.textDark.color,
              fontSize: styles.textFS.fontSize,
              textAlign: styles.textCenter.textAlign,
              marginTop: 50,
            }}
          >
            Hello, world!
          </Text>
          <View style={styles.debugContainer}>
            <Text
              style={[
                styles.debugText,
                { color: isDarkMode ? '#ccc' : '#666' },
              ]}
            >
              Debug Info:
            </Text>
            <Text
              style={[
                styles.debugText,
                { color: isDarkMode ? '#ccc' : '#666' },
              ]}
            >
              Dark Mode: {isDarkMode ? 'ON' : 'OFF'}
            </Text>
            <Text
              style={[
                styles.debugText,
                { color: isDarkMode ? '#ccc' : '#666' },
              ]}
            >
              Platform: {Platform.OS}
            </Text>
            <Text
              style={[
                styles.debugText,
                { color: isDarkMode ? '#ccc' : '#666' },
              ]}
            >
              Safe Area Top: {insets.top}
            </Text>
          </View>
        </View>
      </SafeScreen>
    );
  } catch (error) {
    Logger.error('Error rendering HomeScreen', error);
    throw error;
  }
}

function SettingsScreen({ isDarkMode }: { isDarkMode: boolean }) {
  useEffect(() => {
    Logger.info('SettingsScreen rendered with isDarkMode:', isDarkMode);
  }, [isDarkMode]);

  try {
    return (
      <SafeScreen screenName="Settings">
        <View
          style={[
            styles.container,
            isDarkMode ? styles.darkBg : styles.lightBg,
            styles.centerContent,
          ]}
        >
          <Text
            style={[
              styles.settingsTitle,
              {
                color: isDarkMode
                  ? styles.textLight.color
                  : styles.textDark.color,
              },
            ]}
          >
            Settings Page
          </Text>
          <View style={styles.debugContainer}>
            <Text
              style={[
                styles.debugText,
                { color: isDarkMode ? '#ccc' : '#666' },
              ]}
            >
              Settings Screen Active
            </Text>
            <Text
              style={[
                styles.debugText,
                { color: isDarkMode ? '#ccc' : '#666' },
              ]}
            >
              Theme: {isDarkMode ? 'Dark' : 'Light'}
            </Text>
          </View>
        </View>
      </SafeScreen>
    );
  } catch (error) {
    Logger.error('Error rendering SettingsScreen', error);
    throw error;
  }
}

const Tab = createBottomTabNavigator();

function getTabBarIcon(routeName: string) {
  return ({ color, size }: { color: string; size: number }) => {
    try {
      let iconName = routeName === 'Home' ? 'home-outline' : 'settings-outline';
      Logger.log(`Rendering tab icon for ${routeName}: ${iconName}`);
      return <Icon name={iconName} size={size} color={color} />;
    } catch (error) {
      Logger.error(`Error rendering tab icon for ${routeName}`, error);
      // Fallback to simple text if icon fails
      return <Text style={{ color, fontSize: size / 2 }}>{routeName[0]}</Text>;
    }
  };
}

// Navigation state change handler
const onStateChange = (state: any) => {
  try {
    const currentRoute = state?.routes?.[state?.index];
    Logger.info('Navigation state changed to:', currentRoute?.name);
  } catch (error) {
    Logger.error('Error handling navigation state change', error);
  }
};

function App() {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');
  const [appState, setAppState] = useState<string | null>(
    AppState.currentState,
  );

  // Global error handler
  useEffect(() => {
    Logger.info('App component mounted');
    Logger.info('Initial system scheme:', systemScheme);
    Logger.info('Initial dark mode:', isDarkMode);

    // Suppress specific warnings during development for RN 0.81
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
      const originalHandler = ErrorUtils.getGlobalHandler();

      ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
        Logger.error('Global error caught', {
          error: error?.message || error,
          isFatal,
        });

        if (isFatal) {
          Alert.alert(
            'Fatal Error',
            'The application encountered a fatal error and needs to restart.',
            [{ text: 'OK' }],
          );
        }

        // Call the original handler
        originalHandler?.(error, isFatal);
      });
    };

    setupGlobalErrorHandler();

    // App state change handler
    const handleAppStateChange = (nextAppState: typeof appState) => {
      Logger.info('App state changed:', { from: appState, to: nextAppState });
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      Logger.info('App component unmounting');
      subscription?.remove();
    };
  }, [appState]); // Added appState to dependency array

  // System navigation bar effect with error handling
  useEffect(() => {
    const updateSystemNavigation = async () => {
      try {
        if (Platform.OS === 'android') {
          Logger.info('Updating system navigation bar', { isDarkMode });
          const navColor = isDarkMode ? '#000000' : '#ffffff';
          const iconStyle = isDarkMode ? 'light' : 'dark';

          await SystemNavigationBar.setNavigationColor(
            navColor,
            iconStyle,
            'navigation',
          );
          Logger.info('System navigation bar updated successfully');
        }
      } catch (error) {
        Logger.error('Failed to update system navigation bar', error);
        // Continue execution even if system navigation bar fails
      }
    };

    updateSystemNavigation();
  }, [isDarkMode]);

  // Theme toggle handler with error handling
  const handleThemeToggle = () => {
    try {
      Logger.info('Theme toggle pressed', { currentMode: isDarkMode });
      setIsDarkMode(prev => {
        const newMode = !prev;
        Logger.info('Theme changed to:', newMode ? 'dark' : 'light');
        return newMode;
      });
    } catch (error) {
      Logger.error('Error toggling theme', error);
      Alert.alert('Error', 'Failed to change theme. Please try again.');
    }
  };

  try {
    return (
      <ErrorBoundary>
        <SafeAreaProvider style={styles.container}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
          />
          <NavigationContainer onStateChange={onStateChange}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: getTabBarIcon(route.name),
                tabBarStyle: {
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                },
                tabBarActiveTintColor: isDarkMode ? '#ffffff' : '#000000',
                tabBarInactiveTintColor: isDarkMode ? '#666666' : '#999999',
              })}
            >
              <Tab.Screen name="Home">
                {() => <HomeScreen isDarkMode={isDarkMode} />}
              </Tab.Screen>
              <Tab.Screen name="Settings">
                {() => <SettingsScreen isDarkMode={isDarkMode} />}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>

          <View
            style={[
              styles.switchContainer,
              { backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' },
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
  } catch (error) {
    Logger.error('Critical error in App component', error);
    throw error;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#000',
  },
  lightBg: {
    backgroundColor: '#fff',
  },
  textDark: {
    color: '#000',
  },
  textLight: {
    color: '#fff',
  },
  textFS: {
    fontSize: 24,
  },
  textCenter: {
    textAlign: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    position: 'absolute',
    bottom: 100,
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
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  debugText: {
    fontSize: 12,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
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
  errorDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
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
});

export default App;
