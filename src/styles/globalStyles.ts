import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
    transparentBg: {
    backgroundColor: 'transparent',
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

  lightText: {
    color: 'white',
  },
  darkText: {
    color: 'black',
  },
  debugTitleLight: {
    color: '#666',
  },
  debugTitleDark: {
    color: '#ccc',
  },
  debugTextLight: {
    color: '#666',
  },
  debugTextDark: {
    color: '#ccc',
  },
  logButtonTextLight: {
    color: '#000',
  },
  logButtonTextDark: {
    color: '#fff',
  },
  logButtonBgLight: {
    backgroundColor: '#ddd',
  },
  logButtonBgDark: {
    backgroundColor: '#333',
  },
  debugContainerBgLight: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  debugContainerBgDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  errorButtonPrimary: {
    backgroundColor: '#2196F3',
  },

  // ThemeToggle conditional styles
  switchBgLight: {
    backgroundColor: 'rgba(240,240,240,0.9)',
  },
  switchBgDark: {
    backgroundColor: 'rgba(26,26,26,0.9)',
  },
  switchButtonBgLight: {
    backgroundColor: '#ddd',
  },
  switchButtonBgDark: {
    backgroundColor: '#333',
  },
  switchTextLight: {
    color: '#000',
  },
  switchTextDark: {
    color: '#fff',
  },
  zeroBorderBottom: {
    borderBottomWidth: 0,
  }
});

export const rippleLight = { backgroundColor: 'rgba(0,0,0,0.1)' };
export const rippleDark = { backgroundColor: 'rgba(255,255,255,0.2)' };
