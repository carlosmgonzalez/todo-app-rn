import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import useStoreTodo, { ITodo } from "../store/todoStore";

const TaskInput = ({ user_id }: { user_id: number }) => {
  const [messageBody, setMessageBody] = useState<string>("");
  const createTodo = useStoreTodo((state) => state.createTodo);

  const fetchCreateTodo = (title: string) => {
    fetch(`http://192.168.0.13:3000/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        title,
      }),
    })
      .then((res) => res.json())
      .then((todo: ITodo) => createTodo(todo.title, todo.id));
  };

  const handleSubmit = () => {
    fetchCreateTodo(messageBody);
    setMessageBody("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.containerTextInput}
            placeholder="Write a new task"
            scrollEnabled={true}
            onChangeText={setMessageBody}
            value={messageBody}
          />
          <Pressable onPress={handleSubmit}>
            <AntDesign
              name="checkcircle"
              size={40}
              color={messageBody ? "black" : "#00000050"}
              style={{ paddingLeft: 5 }}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TaskInput;

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.2,
    borderTopColor: "#00000030",
    alignItems: "baseline",
    paddingVertical: 10,
  },
  emojiesContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingLeft: 10,
    marginVertical: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 25,
    paddingVertical: 5,
    marginRight: 10,
  },

  containerTextInput: {
    width: windowWidth - 100,
    borderWidth: 1,
    borderRadius: 30,
    minHeight: 45,
    paddingHorizontal: 15,
    paddingTop: 8,
    fontSize: 16,
    paddingVertical: 5,
    borderColor: "lightgray",
    backgroundColor: "#fff",
    fontWeight: "600",
  },
});
