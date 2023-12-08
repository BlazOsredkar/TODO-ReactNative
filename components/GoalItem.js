import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { AsyncStorage } from "react-native";


function GoalItem(props) {
  const deleteGoalHandler = async (id) => {
    await deleteGoalFromStorage(id); // Delete the goal from AsyncStorage
    props.onDeleteItem(id);
  };

  async function deleteGoalFromStorage(id) {
    try {
      const storedGoals = await AsyncStorage.getItem("courseGoals");
      if (storedGoals !== null) {
        const parsedGoals = JSON.parse(storedGoals);
        const updatedGoals = parsedGoals.filter((goal) => goal.id !== id);
        await AsyncStorage.setItem("courseGoals", JSON.stringify(updatedGoals));
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  }

  return (
    <View style={styles.goalItem}>
      <Pressable
        android_ripple={{ color: "#210644" }}
        onPress={() => deleteGoalHandler(props.id)} // Use an arrow function here
        style={({ pressed }) => pressed && styles.pressedItem}
      >
        <Text style={styles.goalText}>{props.text}</Text>
      </Pressable>
    </View>
  );
}

export default GoalItem;

const styles = StyleSheet.create({
  goalItem: {
    margin: 8,
    borderRadius: 6,
    backgroundColor: "#5e0acc",
  },
  pressedItem: {
    opacity: 0.5,
  },
  goalText: {
    color: "white",
    padding: 8,
  },
});
