import { create } from "zustand";

export interface ITodo {
  id: number;
  title: string;
  shared_with_id: number | null;
  completed: boolean;
}

interface TodoState {
  todos: ITodo[];
  createTodo: (title: string, id: number) => void;
  deleteTodo: (id: number) => void;
  setTodos: (todos: ITodo[]) => void;
}

const useStoreTodo = create<TodoState>()((set) => ({
  todos: [],
  createTodo: (title, id) => {
    set((state) => ({
      todos: [
        ...state.todos,
        { title, completed: false, id, shared_with_id: null },
      ],
    }));
  },
  deleteTodo: (id) => {
    set((state) => {
      return {
        todos: state.todos.filter((todo) => todo.id !== id),
      };
    });
  },
  setTodos: (todos) => {
    set({ todos: todos });
  },
}));

export default useStoreTodo;
