import "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SharedTodoModalContent from "./SharedTodoModalContent";
import TodoModalContent from "./TodoModalContent";

interface Props {
  id: number;
  title: string;
  shared_with_id: number | null;
  completed: boolean;
  deleteTodo: (id: number) => void;
}

interface PropsCheck {
  id: number;
  completed: boolean;
  toggleTodo: () => void;
}

const CheckMark = ({ id, completed, toggleTodo }: PropsCheck) => {
  return (
    <Pressable
      style={{
        ...styles.checkMark,
        backgroundColor: !completed ? "#E9E9EF" : "#0EA5E9",
      }}
      onPress={toggleTodo}
    >
      <Entypo
        style={{ display: !completed ? "none" : "flex" }}
        name="check"
        size={19}
        color="black"
      />
    </Pressable>
  );
};

const Task = ({ id, title, shared_with_id, completed, deleteTodo }: Props) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(completed);
  const [isDeleteActive, setIsDeleteActive] = useState<boolean>(false);

  const fetchToggleTodo = () => {
    fetch(`http://192.168.0.13:3000/api/todos/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const toggleTodo = () => {
    fetchToggleTodo();
    setIsCompleted(!isCompleted);
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const sharedBottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = ["25%", "48%", "75%"];
  const snapPointsShared = ["35%"];

  const handlePresentModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const handlePresentShered = () => {
    sharedBottomSheetRef.current?.present();
  };

  return (
    <TouchableOpacity
      onLongPress={() => setIsDeleteActive(true)}
      onPress={() => setIsDeleteActive(false)}
      style={styles.container}
      activeOpacity={0.8}
    >
      <View style={styles.containerTextCheckBox}>
        <CheckMark completed={isCompleted} id={id} toggleTodo={toggleTodo} />
        <Text>{title}</Text>
      </View>
      {!!shared_with_id ? (
        <Feather
          name="users"
          size={20}
          color="#383839"
          style={{ marginRight: 5 }}
          onPress={handlePresentShered}
        />
      ) : (
        <Feather
          name="share"
          size={20}
          color="#383839"
          style={{ marginRight: 5 }}
          onPress={handlePresentModal}
        />
      )}
      {isDeleteActive ? (
        <Pressable onPress={() => deleteTodo(id)} style={styles.deleteButton}>
          <Text style={{ color: "white", fontWeight: "bold" }}>✖️</Text>
        </Pressable>
      ) : null}
      <BottomSheetModal
        ref={sharedBottomSheetRef}
        snapPoints={snapPointsShared}
        backgroundStyle={{ borderRadius: 25, borderWidth: 2 }}
      >
        <SharedTodoModalContent id={id} completed={isCompleted} />
      </BottomSheetModal>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={2}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 25, borderWidth: 2 }}
      >
        <TodoModalContent id={id} title={title} />
      </BottomSheetModal>
    </TouchableOpacity>
  );
};

export default Task;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 21,
    marginBottom: 10,
    backgroundColor: "white",
  },
  containerTextCheckBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#383839",
    letterSpacing: -0.011 * 16, // 16 = baseFontSize
    flexShrink: 1,
    marginHorizontal: 8,
  },
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: 7,
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: -6,
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  subtitle: {
    color: "#101318",
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    color: "#56636F",
    fontSize: 13,
    fontWeight: "normal",
    width: "100%",
  },
});
