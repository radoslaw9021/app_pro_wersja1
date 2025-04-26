import React from 'react';
import { useTheme } from "../contexts/ThemeContext.jsx";

const ThemeSwitcher = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <div className="theme-switcher flex flex-col items-center p-4 rounded-lg bg-white/80 shadow-sm border border-gray-100">
      <h3 className="mb-3 text-sm font-medium">Wybierz motyw</h3>
      <div className="flex space-x-3">
        {Object.keys(themes).map((themeName) => {
          const theme = themes[themeName];
          const isActive = currentTheme === themeName;
          
          return (
            <button
              key={themeName}
              onClick={() => setTheme(themeName)}
              className={`flex flex-col items-center transition-all duration-200 rounded-lg p-2 ${
                isActive ? 'ring-2 ring-offset-2 ring-gray-400 scale-105' : 'hover:scale-105'
              }`}
              aria-label={`Wybierz motyw ${theme.name}`}
            >
              {/* Próbka kolorów motywu */}
              <div className="theme-preview flex flex-col rounded-md overflow-hidden border border-gray-200 shadow-sm w-12 h-12">
                <div className={`${theme.primaryColor} h-1/2 w-full`}></div>
                <div className={`${theme.secondaryColor} h-1/4 w-full`}></div>
                <div className={`${theme.accentColor} h-1/4 w-full`}></div>
              </div>
              <span className={`mt-1 text-xs ${isActive ? 'font-medium' : 'font-normal'}`}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
