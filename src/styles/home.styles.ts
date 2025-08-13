import { ColorScheme } from '../hooks/useTheme';
import { StyleSheet } from 'react-native';

export const createHomeStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 32,
      paddingBottom: 24,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    titleTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -1,
      marginBottom: 4,
      color: colors.text,
    },
    subtitle: {
      fontSize: 17,
      fontWeight: '500',
      color: colors.textMuted,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    progressBar: {
      flex: 1,
      height: 12,
      borderRadius: 6,
      overflow: 'hidden',
      backgroundColor: colors.border,
    },
    progressFill: {
      height: '100%',
      borderRadius: 6,
    },
    progressText: {
      fontSize: 16,
      fontWeight: '700',
      minWidth: 40,
      textAlign: 'right',
      color: colors.success,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    emptyText: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 8,
      color: colors.text,
    },
    emptySubtext: {
      fontSize: 17,
      textAlign: 'center',
      paddingHorizontal: 40,
      lineHeight: 24,
      color: colors.textMuted,
    },

    // Migrated from screenStyles.ts for theme support
    screenContainer: {
      flex: 1,
      padding: 20,
    },
    darkBg: {
      backgroundColor: colors.bg || '#000',
    },
    lightBg: {
      backgroundColor: colors.surface || '#fff',
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
      color: colors.text,
    },
    debugContainer: {
      marginTop: 30,
      padding: 15,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    debugTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      color: colors.text,
    },
    debugText: {
      fontSize: 12,
      marginVertical: 2,
      color: colors.textMuted,
    },
    logButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
      backgroundColor: colors.primary,
    },
    logButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#fff',
    },
  });

  return styles;
};
