import { StyleSheet } from 'react-native';

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tabBarBgLight: {
    backgroundColor: '#ffffff',
  },
  tabBarBgDark: {
    backgroundColor: '#1a1a1a',
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

  tabLabelActiveLight: {
    color: '#007AFF',
  },
  tabLabelActiveDark: {
    color: '#ffffff',
  },
  tabLabelInactiveLight: {
    color: '#999999',
  },
  tabLabelInactiveDark: {
    color: '#666666',
  },
});
