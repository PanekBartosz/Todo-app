import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Todo } from "./use-todos";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDate, setEditedDate] = useState(
    todo.due_date?.split("T")[0] || new Date().toISOString().split("T")[0]
  );

  const handleUpdate = async () => {
    if (await onUpdate(todo.id, { title: editedTitle, due_date: editedDate })) {
      setIsEditing(false);
    }
  };

  const handleToggle = () => {
    onUpdate(todo.id, { is_complete: !todo.is_complete });
  };

  return (
    <div className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-1 items-center space-x-4">
        <input
          type="checkbox"
          checked={todo.is_complete}
          onChange={handleToggle}
          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        {isEditing ? (
          <div className="flex flex-1 items-center space-x-4">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 rounded border border-gray-300 px-3 py-1 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              className="rounded border border-gray-300 px-3 py-1 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        ) : (
          <div className="flex-1">
            <p
              className={`text-sm ${
                todo.is_complete
                  ? "text-gray-500 line-through"
                  : "text-gray-900"
              }`}
            >
              {todo.title}
            </p>
            {todo.due_date && (
              <p className="mt-1 text-xs text-gray-500">
                Due: {format(parseISO(todo.due_date), "PP")}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="ml-4 flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="rounded px-2 py-1 text-sm text-green-600 hover:bg-green-50"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="hidden rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 group-hover:inline-block"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="hidden rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 group-hover:inline-block"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
