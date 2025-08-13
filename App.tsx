import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { CustomTabNavigator } from './src/layouts/CustomTabNavigator';
import { ThemeProvider, default as useTheme } from './src/hooks/useTheme';
import { globalStyles } from './src/styles/globalStyles';

import { CONVEX_URL } from '@env';
console.log('Convex URL:', CONVEX_URL); // Debugging line to check if the URL is loaded correctly
const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

function App() {
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Match tab bar background color on every theme change
      const navColor = isDarkMode ? '#1a1a1a' : '#ffffff';
      const iconStyle = isDarkMode ? 'light' : 'dark';
      setTimeout(() => {
        try {
          SystemNavigationBar.setNavigationColor(
            navColor,
            iconStyle,
            'navigation',
          );
          import('react-native').then(({ StatusBar }) => {
            StatusBar.setBackgroundColor('transparent', true);
            StatusBar.setTranslucent(true);
          });
        } catch (error) {
          console.error('Failed to update system navigation bar', error);
        }
      }, 100);
    }
  }, [isDarkMode]);

  return (
    <ConvexProvider client={convex}>
      <ErrorBoundary>
        <SafeAreaProvider style={globalStyles.container}>
          <LinearGradient
            colors={colors.gradients.background}
            style={globalStyles.safeArea}
          >
            <SafeAreaView style={globalStyles.safeArea}>
              <CustomTabNavigator />
            </SafeAreaView>
          </LinearGradient>
        </SafeAreaProvider>
      </ErrorBoundary>
    </ConvexProvider>
  );
}

function AppWithThemeProvider() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithThemeProvider;
