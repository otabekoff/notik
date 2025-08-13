import { createTodoStyles } from '../styles/todo.styles';
import { api } from '../../convex/_generated/api';
import useTheme from '../hooks/useTheme';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useMutation } from 'convex/react';
import { LinearGradient } from 'react-native-linear-gradient';
import { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';

const TodoInput = () => {
  const { colors } = useTheme();
  const todoStyles = createTodoStyles(colors);

  const [newTodo, setNewTodo] = useState('');
  const addTodo = useMutation(api.todos.addTodo);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        await addTodo({ text: newTodo.trim() });
        setNewTodo('');
      } catch (error) {
        console.log('Error adding a todo', error);
        Alert.alert('Error', 'Failed to add todo');
      }
    }
  };

  return (
    <View style={todoStyles.inputSection}>
      <View style={todoStyles.inputWrapper}>
        <TextInput
          style={todoStyles.input}
          placeholder="What needs to be done?"
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
          placeholderTextColor={colors.textMuted}
          numberOfLines={1}
          multiline={false}
        />
        <TouchableOpacity
          onPress={handleAddTodo}
          activeOpacity={0.8}
          disabled={!newTodo.trim()}
        >
          <LinearGradient
            colors={
              newTodo.trim() ? colors.gradients.primary : colors.gradients.muted
            }
            style={[todoStyles.addButton, !newTodo.trim() && todoStyles.addButtonDisabled]}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoInput;
