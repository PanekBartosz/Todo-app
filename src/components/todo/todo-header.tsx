import Logo from "../Logo";

interface TodoHeaderProps {
  onLogout: () => void;
}

export function TodoHeader({ onLogout }: TodoHeaderProps) {
  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Logo />
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </div>
        <button
          onClick={onLogout}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
