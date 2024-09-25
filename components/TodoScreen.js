import { Text, View, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { useData } from '../hooks/saveData';

export default function TodoScreen() {

  const { getData, saveData } = useData()
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getData().then(data => {
      if (data) setTasks(data);
    }).catch(error => {
      console.log(error)
    })
  }, [])

  const save = () => {
    saveData(tasks).then(() => {
     
    }).catch(error => {
      console.log(error)
    })
  }

  const addTask = () => {
    if (task.trim() !== '') {
      const newTasks = [...tasks, { text: task, done: false }]
      setTasks(newTasks)
      setTask('')

      saveData(newTasks).then(() => {
        console.log("asia lisätty onnistuneesti")
      }).catch(error => {
        console.log("Ei onnistu:", error)
      })
    }
  }

  const TaskIsDone = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    )
    setTasks(updatedTasks);

   
    saveData(updatedTasks).catch(error => {
      console.log("vithe päivityksessä", error)
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={setTask} 
      />

      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => TaskIsDone(index)}>
            <View style={styles.taskItem}>
              <Text style={item.done ? styles.taskTextDone : null}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#1e90ff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    backgroundColor: '#f0f8ff',
    marginVertical: 4,
    borderRadius: 6,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: 'black',
  },
});
