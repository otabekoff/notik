import { StyleSheet } from 'react-native';

export const screenStyles = StyleSheet.create({
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
  marginTop10: {
    marginTop: 10,
  },
});
