// Returns dynamic style for checkbox inner
export function getCheckboxInnerStyle(isCompleted: boolean, colors: any) {
  return {
    borderColor: isCompleted ? colors.success : colors.border,
    borderWidth: 2,
    backgroundColor: isCompleted ? colors.success : colors.border,
  };
}
import { ColorScheme } from '../hooks/useTheme';
import { StyleSheet } from 'react-native';

export const createTodoStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputSection: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginBottom: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 8,
      paddingHorizontal: 0,
      backgroundColor: 'transparent',
    },
    addButton: {
      marginLeft: 8,
      borderRadius: 999,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    todoItemWrapper: {
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      padding: 12,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      backgroundColor: colors.surface,
    },
    checkbox: {
      marginRight: 12,
    },
    checkboxInner: {
      width: 24,
      height: 24,
      borderRadius: 999,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todoTextRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    todoTextContainer: {
      flex: 1,
      marginRight: 12,
    },
    todoText: {
      fontSize: 16,
      color: colors.text,
    },
    todoTextCompleted: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
      opacity: 0.6,
    },
    todoActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      borderRadius: 8,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 0,
    },
    editContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    editInput: {
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
    },
    editButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    editButton: {
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    editButtonText: {
      color: '#fff',
      fontSize: 14,
      marginLeft: 4,
    },
    todoList: {
      flex: 1,
      marginTop: 8,
    },
    todoListContent: {
      paddingBottom: 32,
    },
  });
  return styles;
};
