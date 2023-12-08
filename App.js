import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Button, AsyncStorage } from "react-native";
import { StatusBar } from "expo-status-bar";

import GoalItem from "./components/GoalItem";
import GoalInput from "./components/GoalInput";

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [courseGoals, setCourseGoals] = useState([]);

  useEffect(() => {
    // Load stored data on app start
    loadGoals();
  }, []);

  useEffect(() => {
    // Save data whenever courseGoals state changes
    saveGoals();
  }, [courseGoals]);

  // Function to load goals from AsyncStorage
  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem("courseGoals");
      if (storedGoals !== null) {
        setCourseGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  // Function to save goals to AsyncStorage
  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem("courseGoals", JSON.stringify(courseGoals));
    } catch (error) {
      console.error("Error saving goals:", error);
    }
  };

  function startAddGoalHandler() {
    setModalIsVisible(true);
  }

  function endAddGoalHandler() {
    setModalIsVisible(false);
  }

  function addGoalHandler(enteredGoalText) {
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      { text: enteredGoalText, id: Math.random().toString() },
    ]);
    endAddGoalHandler();
  }

  function deleteGoalHandler(id) {
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter((goal) => goal.id !== id);
    });
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.appContainer}>
        <Button
          title="Dodaj nov cilj"
          color="#a065ec"
          onPress={startAddGoalHandler}
        />
        <GoalInput
          visible={modalIsVisible}
          onAddGoal={addGoalHandler}
          onCancel={endAddGoalHandler}
        />
        <View style={styles.goalsContainer}>
          <FlatList
            data={courseGoals}
            renderItem={(itemData) => {
              return (
                <GoalItem
                  text={itemData.item.text}
                  id={itemData.item.id}
                  onDeleteItem={deleteGoalHandler}
                />
              );
            }}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            alwaysBounceVertical={false}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  goalsContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  addGoalButton: {
    marginBottom: 20,
  },
});
