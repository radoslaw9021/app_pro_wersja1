import React, { createContext, useState, useContext, useEffect } from 'react';

// Definicje dostępnych motywów
const themes = {
  pink: {
    name: 'Pink',
    primaryColor: 'bg-pink-200',
    secondaryColor: 'bg-pink-100',
    textColor: 'text-pink-900',
    accentColor: 'bg-pink-500',
    buttonClass: 'bg-pink-500 hover:bg-pink-600',
    borderClass: 'border-pink-300',
    fontFamily: 'font-sans'
  },
  lavender: {
    name: 'Lavender',
    primaryColor: 'bg-purple-200',
    secondaryColor: 'bg-purple-100',
    textColor: 'text-purple-900',
    accentColor: 'bg-amber-400',
    buttonClass: 'bg-purple-400 hover:bg-purple-500',
    borderClass: 'border-purple-300',
    fontFamily: 'font-sans'
  },
  neutral: {
    name: 'Neutral',
    primaryColor: 'bg-gray-100',
    secondaryColor: 'bg-white',
    textColor: 'text-gray-800',
    accentColor: 'bg-gray-400',
    buttonClass: 'bg-gray-500 hover:bg-gray-600',
    borderClass: 'border-gray-300',
    fontFamily: 'font-serif'
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Pobranie zapisanego motywu z localStorage lub ustawienie domyślnego
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('beautyAI-theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'pink';
  });

  // Aktualizacja motywu i zapisanie w localStorage
  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('beautyAI-theme', themeName);
    }
  };

  // Zastosowanie klasy motywu do elementu body
  useEffect(() => {
    const body = document.body;
    
    // Usunięcie wszystkich poprzednich klas motywów
    Object.keys(themes).forEach(theme => {
      body.classList.remove(`theme-${theme}`);
    });
    
    // Dodanie nowej klasy motywu
    body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  // Wartość kontekstu
  const value = {
    currentTheme,
    setTheme,
    themes,
    themeColors: themes[currentTheme]
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook do łatwego wykorzystania kontekstu motywu
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
