import { useTodos } from "./use-todos";
import { TodoTabs } from "./todo-tabs";
import { TodoItem } from "./todo-item";
import { isToday, isFuture, parseISO } from "date-fns";

export function TodoList() {
  const {
    todos,
    activeTab,
    setActiveTab,
    itemsToShow,
    setItemsToShow,
    updateTodo,
    deleteTodo,
  } = useTodos();

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

  const paginatedTodos = filteredTodos.slice(0, itemsToShow);
  const hasMoreItems = filteredTodos.length > itemsToShow;

  return (
    <div>
      <TodoTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="space-y-3">
        {paginatedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
      {hasMoreItems && (
        <button
          onClick={() => setItemsToShow((prev) => prev + 5)}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Show More
        </button>
      )}
      {paginatedTodos.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          No tasks found in this category.
        </p>
      )}
    </div>
  );
}
