"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import Logo from "./Logo";
import { format, isToday, isFuture, parseISO } from "date-fns";

interface Todo {
  id: number;
  user_id: string;
  title: string;
  description: string;
  is_complete: boolean;
  created_at: string;
  due_date: string | null;
}

type Tab = "today" | "upcoming" | "all" | "done";

export default function Todo() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDate, setNewTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [completingTodos, setCompletingTodos] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      fetchTodos();
      const subscription = supabase
        .channel("todos")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "todos" },
          fetchTodos
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  async function fetchTodos() {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim() || !user) return;

    try {
      const { error } = await supabase.from("todos").insert([
        {
          title: newTask,
          description: "",
          user_id: user.id,
          due_date: new Date(newTaskDate).toISOString(),
        },
      ]);

      if (error) throw error;
      setNewTask("");
      setNewTaskDate(new Date().toISOString().split("T")[0]);
      await fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function updateTodo(id: number, updates: Partial<Todo>) {
    try {
      const { error } = await supabase
        .from("todos")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      await fetchTodos();
      setEditingTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function toggleTodo(id: number, is_complete: boolean) {
    if (!is_complete) {
      setCompletingTodos((prev) => [...prev, id]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCompletingTodos((prev) => prev.filter((todoId) => todoId !== id));
    }
    await updateTodo(id, { is_complete: !is_complete });
  }

  async function deleteTodo(id: number) {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  function startEditing(todo: Todo) {
    setEditingTodo(todo);
    setEditedTask(todo.title);
    setEditedDate(todo.due_date || new Date().toISOString().split("T")[0]);
  }

  function handleSaveEdit() {
    if (!editingTodo) return;
    updateTodo(editingTodo.id, {
      title: editedTask,
      due_date: new Date(editedDate).toISOString(),
    });
  }

  const filteredTodos = todos.filter((todo) => {
    if (activeTab === "today") {
      return (
        todo.due_date && isToday(parseISO(todo.due_date)) && !todo.is_complete
      );
    }
    if (activeTab === "upcoming") {
      return (
        todo.due_date && isFuture(parseISO(todo.due_date)) && !todo.is_complete
      );
    }
    if (activeTab === "done") {
      return todo.is_complete;
    }
    if (activeTab === "all") {
      return !todo.is_complete;
    }
    return true;
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 z-10 w-full border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Logo />
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16">
        {/* Tabs */}
        <div className="mb-8 flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab("today")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "today"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "upcoming"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "all"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab("done")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "done"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Done
          </button>
        </div>

        {/* Add todo form */}
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-3"
            />
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Todo list */}
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              {editingTodo?.id === todo.id ? (
                <div className="flex flex-1 items-center space-x-3">
                  <input
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    placeholder="Task title"
                  />
                  <input
                    type="date"
                    value={editedDate.split("T")[0]}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTodo(null)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTodo(todo.id, todo.is_complete)}
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        todo.is_complete || completingTodos.includes(todo.id)
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-gray-400"
                      }`}
                    >
                      {(todo.is_complete ||
                        completingTodos.includes(todo.id)) && (
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <div>
                      <span
                        className={`block text-gray-900 ${
                          todo.is_complete || completingTodos.includes(todo.id)
                            ? "line-through opacity-50"
                            : ""
                        }`}
                      >
                        {todo.title}
                      </span>
                      {todo.description && (
                        <span
                          className={`text-sm text-gray-500 block ${
                            todo.is_complete ||
                            completingTodos.includes(todo.id)
                              ? "line-through opacity-50"
                              : ""
                          }`}
                        >
                          {todo.description}
                        </span>
                      )}
                      {todo.due_date && (
                        <span
                          className={`text-sm text-gray-500 ${
                            todo.is_complete ||
                            completingTodos.includes(todo.id)
                              ? "line-through opacity-50"
                              : ""
                          }`}
                        >
                          Due: {format(parseISO(todo.due_date), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {filteredTodos.length === 0 && (
            <div className="text-center">
              <p className="text-gray-500">
                No tasks yet. Add your first task!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
