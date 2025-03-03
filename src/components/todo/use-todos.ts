import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export interface Todo {
  id: number;
  user_id: string;
  title: string;
  description: string;
  is_complete: boolean;
  created_at: string;
  due_date: string | null;
}

export type Tab = "today" | "upcoming" | "all" | "done";

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [itemsToShow, setItemsToShow] = useState(5);

  const fetchTodos = useCallback(async () => {
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
  }, [user]);

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
  }, [user, fetchTodos]);

  async function addTodo(title: string, dueDate: string) {
    if (!title.trim() || !user) return;

    try {
      const { error } = await supabase.from("todos").insert([
        {
          title,
          description: "",
          user_id: user.id,
          due_date: new Date(dueDate).toISOString(),
        },
      ]);

      if (error) throw error;
      await fetchTodos();
      return true;
    } catch (error) {
      console.error("Error adding todo:", error);
      return false;
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
      return true;
    } catch (error) {
      console.error("Error updating todo:", error);
      return false;
    }
  }

  async function deleteTodo(id: number) {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
      await fetchTodos();
      return true;
    } catch (error) {
      console.error("Error deleting todo:", error);
      return false;
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

  return {
    todos,
    loading,
    activeTab,
    setActiveTab,
    itemsToShow,
    setItemsToShow,
    addTodo,
    updateTodo,
    deleteTodo,
    handleLogout,
  };
}
