import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  // This effect will run whenever `isDark` changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
