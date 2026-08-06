import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('settle_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark'; // Default to Linear dark mode

// [v80] feat(models): add settlement note field for custom transfer remarks
