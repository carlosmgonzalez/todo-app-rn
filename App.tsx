import "react-native-gesture-handler";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaFrame,
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import Task from "./src/components/Task";
import TaskInput from "./src/components/TaskInput";
import useStoreTodo, { ITodo } from "./src/store/todoStore";

interface IUser {
  id: number;
  name: string;
  email: string;
}

function App() {
  const todosG = useStoreTodo((state) => state.todos);
  const setTodosG = useStoreTodo((state) => state.setTodos);
  const deleteTodoG = useStoreTodo((state) => state.deleteTodo);

  const [user, setUser] = useState<IUser>();
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUserById = (id: number) => {
    fetch(`http://192.168.0.13:3000/api/user/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((user) => setUser(user));
  };

  const getTodosByUserId = (id: number) => {
    setIsLoading(true);
    fetch(`http://192.168.0.13:3000/api/todos/user/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((todos) => {
        setTodosG(todos);
        setTodos(todos);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchDeleteTodo = (id: number) => {
    fetch(`http://192.168.0.13:3000/api/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const deleteTodo = (id: number) => {
    fetchDeleteTodo(id);
    deleteTodoG(id);
  };

  useEffect(() => {
    getUserById(1);
    getTodosByUserId(1);
  }, []);

  return (
    <SafeAreaProvider>
      <BottomSheetModalProvider>
        <LinearGradient
          colors={["#d3e9ff", "#c6e2ff"]}
          style={{ ...styles.container }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {isLoading ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <ActivityIndicator size={40} />
              </View>
            ) : (
              <FlatList
                data={todosG}
                renderItem={({ item }) => (
                  <Task {...item} deleteTodo={deleteTodo} />
                )}
                keyExtractor={(todoG) => todoG.id.toString()}
                ListHeaderComponent={() => (
                  <Text style={styles.title}>Today</Text>
                )}
                contentContainerStyle={styles.contentContainer}
              />
            )}
            <TaskInput user_id={user?.id || 1} />
          </SafeAreaView>
        </LinearGradient>
      </BottomSheetModalProvider>
    </SafeAreaProvider>
  );
}

export default gestureHandlerRootHOC(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 15,
  },
  contentContainer: {
    padding: 15,
  },
});
