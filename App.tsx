import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');

  // Add a new task
  const addTask = () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  // Toggle task completion status
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

// Delete a task immediately
const deleteTask = (id: string) => {
  setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
};

  // Render individual task item
  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity 
        style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
        onPress={() => toggleTask(item.id)}
      >
        {item.completed && (
          <Ionicons name="checkmark" size={18} color="#fff" />
        )}
      </TouchableOpacity>
      
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
          {item.text}
        </Text>
        <Text style={styles.dateText}>
          {item.createdAt instanceof Date
            ? item.createdAt.toLocaleString()
            : new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4757" />
      </TouchableOpacity>
    </View>
  );

  // Calculate task statistics
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <Text style={styles.statsText}>
          {completedCount} of {totalCount} completed
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Add a new task..."
          placeholderTextColor="#95a5a6"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>No tasks yet!</Text>
          <Text style={styles.emptySubtext}>Add a task above to get started</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 5,
  },
  statsText: {
    fontSize: 16,
    color: '#95a5a6',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#34495e',
    color: '#ecf0f1',
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34495e',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#95a5a6',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#ecf0f1',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  dateText: {
    fontSize: 12,
    color: '#bdc3c7',
    marginTop: 2,
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#95a5a6',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
