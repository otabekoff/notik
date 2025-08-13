import { useEffect } from 'react';
import { Platform } from 'react-native';
import React from 'react';
import { createTodoStyles, getCheckboxInnerStyle } from '../styles/todo.styles';
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
// Removed unused SafeAreaView import
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { PersistentLogger } from '../utils/PersistentLogger';

function TodoScreen() {
  const { colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        try {
          // Match tab bar background color
          const navColor = colors.statusBarStyle === 'dark-content' ? '#ffffff' : '#1a1a1a';
          // These values match tabBarBgLight and tabBarBgDark
          const iconStyle = colors.statusBarStyle === 'dark-content' ? 'dark' : 'light';
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
      }, 100);
    }
  }, [colors.statusBarStyle]);
  const [editingId, setEditingId] = useState<Id<'todos'> | null>(null);
  const [editText, setEditText] = useState('');

  const todoStyles = createTodoStyles(colors);

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
      <View style={todoStyles.todoItemWrapper}>
        <LinearGradient
          colors={colors.gradients.surface}
          style={todoStyles.todoItem}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            style={todoStyles.checkbox}
            activeOpacity={0.7}
            onPress={() => handleToggleTodo(item._id)}
          >
            <View
              style={[
                todoStyles.checkboxInner,
                getCheckboxInnerStyle(item.isCompleted, colors),
              ]}
            >
              {item.isCompleted && (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
            </View>
          </TouchableOpacity>

          {isEditing ? (
            <View style={todoStyles.editContainer}>
              <TextInput
                style={todoStyles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                placeholder="Edit your todo..."
                placeholderTextColor={colors.textMuted}
              />
              <View style={todoStyles.editButtons}>
                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                  <LinearGradient
                    colors={colors.gradients.success}
                    style={todoStyles.editButton}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={todoStyles.editButtonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.muted}
                    style={todoStyles.editButton}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={todoStyles.editButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={todoStyles.todoTextRow}>
              <TouchableOpacity
                style={todoStyles.todoTextContainer}
                onPress={() => handleEditTodo(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[todoStyles.todoText, item.isCompleted ? todoStyles.todoTextCompleted : null]}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
              <View style={todoStyles.todoActions}>
                <TouchableOpacity
                  onPress={() => handleDeleteTodo(item._id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.danger}
                    style={todoStyles.actionButton}
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
    <>
      <StatusBar
        barStyle={colors.statusBarStyle}
        translucent={true}
        backgroundColor="transparent"
      />
      <View style={todoStyles.container}>
        <Header />
        <TodoInput />
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={item => item._id}
          style={todoStyles.todoList}
          contentContainerStyle={todoStyles.todoListContent}
          ListEmptyComponent={<EmptyState />}
        />
      </View>
    </>
  );
}

export default TodoScreen;
