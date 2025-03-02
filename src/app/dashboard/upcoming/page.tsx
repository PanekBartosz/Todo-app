import { TodoList } from "@/components/todos/todo-list";
import { Navbar } from "@/components/layout/navbar";
import { Tabs } from "@/components/layout/tabs";

export default function Upcoming() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs />
          <TodoList filter="upcoming" />
        </div>
      </main>
    </div>
  );
}
