import { TodoList } from "./todo-list";
import { TodoHeader } from "./todo-header";
import { TodoForm } from "./todo-form";
import { useTodos } from "./use-todos";
import { LoadingSpinner } from "../ui/loading-spinner";

export default function Todo() {
  const { loading, handleLogout } = useTodos();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TodoHeader onLogout={handleLogout} />
      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16">
        <TodoForm />
        <TodoList />
      </main>
    </div>
  );
}
