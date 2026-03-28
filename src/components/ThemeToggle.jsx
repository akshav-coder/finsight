import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl flex items-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors ${className}`}
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold ml-3 min-w-[max-content]">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold ml-3 min-w-[max-content]">Dark Mode</span>
        </>
      )}
    </button>
  );
}
