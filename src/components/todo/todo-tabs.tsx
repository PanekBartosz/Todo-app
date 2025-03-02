import { useTodos, Tab } from "./use-todos";
import { isToday, parseISO } from "date-fns";

interface TodoTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TodoTabs({ activeTab, onTabChange }: TodoTabsProps) {
  const { todos } = useTodos();

  const todayCount = todos.filter(
    (todo) =>
      todo.due_date && isToday(parseISO(todo.due_date)) && !todo.is_complete
  ).length;

  const upcomingCount = todos.filter(
    (todo) =>
      todo.due_date && !isToday(parseISO(todo.due_date)) && !todo.is_complete
  ).length;

  const tabs: Array<{ id: Tab; label: string; count?: number }> = [
    { id: "today", label: "Today", count: todayCount },
    { id: "upcoming", label: "Upcoming", count: upcomingCount },
    { id: "all", label: "All" },
    { id: "done", label: "Done" },
  ];

  return (
    <div className="mb-8 flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative min-w-[120px] border-b-2 px-8 py-4 text-sm font-medium ${
            activeTab === tab.id
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <span className="relative">
            {tab.label}
            {tab.count ? (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600">
                {tab.count}
              </span>
            ) : null}
          </span>
        </button>
      ))}
    </div>
  );
}
