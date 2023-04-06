'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ({ children }: Props) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const theme = localStorage.getItem('theme') as 'dark' | 'light';
    return theme ?? 'light';
  });

  const setThemeAndSave = useCallback((theme: 'dark' | 'light') => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeAndSave,
      }}
    >
      <div className={`flex min-w-min ${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
