import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Animated } from "react-native";
import { BottomSheet } from "react-native-btr";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import tw from "twrnc";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [fadeAnimAdd] = useState(new Animated.Value(0));
  const [fadeAnimDelete] = useState(new Animated.Value(0));
  const [fadeAnimComplete] = useState(new Animated.Value(0));
  const [fadeAnimUnComplete] = useState(new Animated.Value(0));

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const toggleBottomSheet = () => {
    setIsVisible(!isVisible);
  };

  const handleAddTask = async (task: Task) => {
    try {
      const existingTasks = await AsyncStorage.getItem("tasks");
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
      tasks.push(task);
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();

      Animated.timing(fadeAnimAdd, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        fadeAnimAdd.setValue(0);
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    fadeAnimDelete.setValue(0);

    Animated.timing(fadeAnimDelete, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
        AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });

      fadeAnimDelete.setValue(0);
    });
  };

  const handleCompletedTask = async (taskId: string) => {
    fadeAnimComplete.setValue(0);

    Animated.timing(fadeAnimComplete, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );

      setTasks(updatedTasks);
      AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

      fadeAnimComplete.setValue(0);
    });
  };

  const handleUnCompletedTask = async (taskId: string) => {
    fadeAnimUnComplete.setValue(0);

    Animated.timing(fadeAnimUnComplete, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );

      setTasks(updatedTasks);
      AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

      fadeAnimUnComplete.setValue(0);
    });
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1 pt-20 px-4`}>
        <Text style={tw`text-xl font-bold`}>TodoS App</Text>

        {/* Counter */}
        <View style={tw`flex-row pt-2 gap-2 flex-wrap`}>
          <View
            style={tw`flex-1 min-w-[150px] bg-gray-200 p-4 items-center justify-center rounded-lg`}
          >
            <Text style={tw`text-lg`}>Tasks Pending</Text>
            <Text style={tw`text-4xl pt-2`}>
              {tasks.filter((task) => !task.isCompleted).length}
            </Text>
          </View>
          <View
            style={tw`flex-1 min-w-[150px] bg-gray-300 p-4 items-center justify-center rounded-lg`}
          >
            <Text style={tw`text-lg`}>Tasks Completed</Text>
            <Text style={tw`text-4xl pt-2`}>
              {tasks.filter((task) => task.isCompleted).length}
            </Text>
          </View>
        </View>

        <View style={tw`h-3/4`}>
          {tasks.filter((task) => !task.isCompleted).length === 0 ? (
            <View style={tw`flex-1 items-center justify-center mt-10`}>
              <Text style={tw`text-lg`}>No pending tasks available.</Text>
            </View>
          ) : (
            <>
              <Text style={tw`text-lg font-bold`}>Tasks Pending</Text>
              <FlatList
                style={tw`bg-white p-4 mt-4 rounded-lg pb-10`}
                data={tasks.filter((task) => !task.isCompleted)}
                renderItem={({ item }) => (
                  <View style={tw`flex-row items-center m-2`}>
                    <TouchableOpacity
                      style={tw`p-2 rounded-lg`}
                      onPress={() => handleCompletedTask(item.id)}
                    >
                      <View
                        style={tw`w-6 h-6 border-2 ${
                          item.isCompleted
                            ? "border-blue-500"
                            : "border-gray-400"
                        } rounded-full justify-center items-center`}
                      >
                        {item.isCompleted ? (
                          <View
                            style={tw`w-4 h-4 bg-blue-500 rounded-full justify-center items-center`}
                          >
                            <Text style={tw`text-white text-lg`}>✔</Text>
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                    <Text style={tw`text-lg ml-2`}>{item.name}</Text>
                    <TouchableOpacity
                      style={tw`bg-red-500 p-2 rounded-lg ml-auto`}
                      onPress={() => handleDeleteTask(item.id)}
                    >
                      <MaterialCommunityIcons
                        name="trash-can"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </>
          )}

          {tasks.some((task) => task.isCompleted) && (
            <>
              <Text style={tw`text-lg font-bold mt-4`}>Tasks Completed</Text>
              <FlatList
                style={tw`bg-white p-4 mt-4 rounded-lg h-full`}
                data={tasks.filter((task) => task.isCompleted)}
                renderItem={({ item }) => (
                  <View style={tw`flex-row items-center mt-4`}>
                    <TouchableOpacity
                      style={tw`p-2 rounded-lg`}
                      onPress={() => handleUnCompletedTask(item.id)}
                    >
                      <View
                        style={tw`w-6 h-6 border-2 ${
                          item.isCompleted
                            ? "border-blue-500"
                            : "border-gray-400"
                        } rounded-full justify-center items-center`}
                      >
                        {item.isCompleted ? (
                          <View
                            style={tw`w-4 h-4 bg-blue-500 rounded-full justify-center items-center`}
                          >
                            <Text style={tw`text-white text-lg`}>✔</Text>
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                    <Text
                      style={tw`text-lg ml-2 ${
                        item.isCompleted ? "line-through" : ""
                      }`}
                    >
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      style={tw`bg-red-500 p-2 rounded-lg ml-auto`}
                      onPress={() => handleDeleteTask(item.id)}
                    >
                      <MaterialCommunityIcons
                        name="trash-can"
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <Text style={tw`text-lg`}>No completed tasks available.</Text>
                }
              />
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          left: "90%",
          transform: [{ translateX: -25 }],
          backgroundColor: "#3b82f6",
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={toggleBottomSheet}
      >
        <Text style={{ color: "white", fontSize: 24 }}>+</Text>
      </TouchableOpacity>

      <BottomSheet
        visible={isVisible}
        onBackButtonPress={toggleBottomSheet}
        onBackdropPress={toggleBottomSheet}
      >
        <View
          style={{
            padding: 20,
            backgroundColor: "white",
            height: "18%",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <TextInput
            placeholder="Add Task"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 6,
              paddingLeft: 10,
              marginBottom: 8,
              marginTop: 2,
            }}
            value={taskName}
            onChangeText={setTaskName}
          />
          <Button
            title="Add Task"
            onPress={() => {
              const newTask: Task = {
                id: uuidv4(),
                name: taskName,
                isCompleted: false,
              };
              handleAddTask(newTask);
              setTaskName("");
              toggleBottomSheet();
            }}
            disabled={taskName.length === 0}
          />
        </View>
      </BottomSheet>

      <Animated.View
        style={{
          opacity: fadeAnimAdd,
          position: "absolute",
          top: 50,
          left: "50%",
          transform: [{ translateX: -50 }],
        }}
      >
        <Text style={{ color: "green", fontSize: 24 }}>Task Added!</Text>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnimDelete,
          position: "absolute",
          top: 50,
          left: "50%",
          transform: [{ translateX: -50 }],
        }}
      >
        <Text style={{ color: "red", fontSize: 24 }}>Task Deleted!</Text>
        {/* Tampilkan pesan animasi */}
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnimComplete,
          position: "absolute",
          top: 50,
          left: "50%",
          transform: [{ translateX: -50 }],
        }}
      >
        <Text style={{ color: "blue", fontSize: 24 }}>Task Completed!</Text>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnimUnComplete,
          position: "absolute",
          top: 50,
          left: "50%",
          transform: [{ translateX: -50 }],
        }}
      >
        <Text style={{ color: "blue", fontSize: 24 }}>Task Undo!</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
