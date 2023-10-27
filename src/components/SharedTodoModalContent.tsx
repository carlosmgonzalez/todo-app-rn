import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

interface IData {
  title: number;
  completed: boolean;
  author: string;
  shared_with: string;
}

const SharedTodoModalContent = ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  const [todo, setTodo] = useState<IData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInfoTodo = () => {
    setIsLoading(true);
    fetch(`http://192.168.0.13:3000/api/todos/author-shared/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: IData) => setTodo(data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInfoTodo();
  }, []);

  return (
    <View style={styles.contentContainer}>
      <Text style={[styles.title, { marginBottom: 20 }]}>Shared Tasks</Text>
      {todo && !isLoading ? (
        <>
          <Text style={[styles.title, { marginBottom: 20 }]}>
            "{todo.title}"
          </Text>
          <Text style={[styles.title]}>Status</Text>
          <View
            style={[
              styles.status,
              { backgroundColor: completed ? "#4ade80" : "#f87171" },
            ]}
          >
            <Text style={[styles.title, { color: "white" }]}>
              {completed ? "Completed" : "Incompleted"}
            </Text>
          </View>
          <Text style={[styles.description]}>PARTICIPANTS</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.participant}>
              <Text style={[styles.description, { color: "white" }]}>
                {todo.author}
              </Text>
            </View>
            <View style={styles.participant}>
              <Text style={[styles.description, { color: "white" }]}>
                {todo.shared_with}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <ActivityIndicator size={40} />
        </View>
      )}
    </View>
  );
};

export default SharedTodoModalContent;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
    textAlign: "center",
  },
  description: {
    color: "black",
    fontSize: 13,
    fontWeight: "900",
  },
  participant: {
    backgroundColor: "#8b5cf6",
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 20,
    fontWeight: "900",
    color: "white",
  },
  input: {
    borderWidth: 2,
    borderColor: "#00000020",
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
  },
  status: {
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 20,
    fontWeight: "900",
    color: "white",
  },
});
