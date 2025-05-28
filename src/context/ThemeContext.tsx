import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';  

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved === 'true' || false;
    }
    return false;
  });

  
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', String(newMode));
      return newMode;
    });
  };

 
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};