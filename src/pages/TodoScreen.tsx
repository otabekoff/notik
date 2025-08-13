import { useEffect } from 'react';
import { Platform } from 'react-native';
import React from 'react';
import { createHomeStyles } from '../styles/home.styles';
import EmptyState from '../components/EmptyState';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import TodoInput from '../components/TodoInput';
import { api } from '../../convex/_generated/api';
import { Doc, Id } from '../../convex/_generated/dataModel';

type Todo = Doc<'todos'>;
import useTheme from '../hooks/useTheme';
// Make sure to install react-native-vector-icons for this import to work:
// npm install react-native-vector-icons
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useMutation, useQuery } from 'convex/react';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/globalStyles';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { PersistentLogger } from '../utils/PersistentLogger';

function TodoScreen() {
  const { colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Delay to ensure activity is available
      setTimeout(() => {
        try {
          const navColor =
            colors.statusBarStyle === 'dark-content' ? '#00C853' : '#2962FF';
          const iconStyle =
            colors.statusBarStyle === 'dark-content' ? 'dark' : 'light';
          SystemNavigationBar.setNavigationColor(
            navColor,
            iconStyle,
            'navigation',
          );
        } catch (error) {
          PersistentLogger.error(
            'Failed to update system navigation bar',
            error,
          );
        }
      }, 100); // 100ms delay
    }
  }, [colors.statusBarStyle]);
  const [editingId, setEditingId] = useState<Id<'todos'> | null>(null);
  const [editText, setEditText] = useState('');

  const homeStyles = createHomeStyles(colors);

  const todos = useQuery(api.todos.getTodos);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  const isLoading = todos === undefined;
  if (isLoading) return <LoadingSpinner />;

  const handleToggleTodo = async (id: Id<'todos'>) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      console.log('Error toggling todo', error);
      Alert.alert('Error', 'Failed to toggle todo');
    }
  };

  const handleDeleteTodo = async (id: Id<'todos'>) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTodo({ id }),
      },
    ]);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditText(todo.text);
    setEditingId(todo._id);
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      try {
        await updateTodo({ id: editingId, text: editText.trim() });
        setEditingId(null);
        setEditText('');
      } catch (error) {
        console.log('Error updating todo', error);
        Alert.alert('Error', 'Failed to update todo');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const renderTodoItem = ({ item }: { item: Todo }) => {
    const isEditing = editingId === item._id;
    return (
      <View style={homeStyles.todoItemWrapper}>
        <LinearGradient
          colors={colors.gradients.surface}
          style={homeStyles.todoItem}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            style={homeStyles.checkbox}
            activeOpacity={0.7}
            onPress={() => handleToggleTodo(item._id)}
          >
            <LinearGradient
              colors={
                item.isCompleted
                  ? colors.gradients.success
                  : colors.gradients.muted
              }
              style={[
                {
                  ...homeStyles.checkboxInner,
                  borderColor: item.isCompleted
                    ? globalStyles.transparentBg.backgroundColor
                    : colors.border,
                },
              ]}
            >
              {item.isCompleted && (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {isEditing ? (
            <View style={homeStyles.editContainer}>
              <TextInput
                style={homeStyles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                placeholder="Edit your todo..."
                placeholderTextColor={colors.textMuted}
              />
              <View style={homeStyles.editButtons}>
                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                  <LinearGradient
                    colors={colors.gradients.success}
                    style={homeStyles.editButton}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCancelEdit}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.muted}
                    style={homeStyles.editButton}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={homeStyles.todoTextContainer}>
              <Text
                style={[
                  {
                    ...homeStyles.todoText,
                    ...(item.isCompleted
                      ? {
                          textDecorationLine: 'line-through',
                          color: colors.textMuted,
                          opacity: 0.6,
                        }
                      : {}),
                  },
                ]}
              >
                {item.text}
              </Text>

              <View style={homeStyles.todoActions}>
                <TouchableOpacity
                  onPress={() => handleEditTodo(item)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.warning}
                    style={homeStyles.actionButton}
                  >
                    <Ionicons name="pencil" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteTodo(item._id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.danger}
                    style={homeStyles.actionButton}
                  >
                    <Ionicons name="trash" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={homeStyles.container}
    >
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={
          colors.statusBarStyle === 'dark-content' ? '#00C853' : '#2962FF'
        }
      />
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />
        <TodoInput />
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={item => item._id}
          style={homeStyles.todoList}
          contentContainerStyle={homeStyles.todoListContent}
          ListEmptyComponent={<EmptyState />}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

export default TodoScreen;
