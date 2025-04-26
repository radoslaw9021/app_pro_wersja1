import React from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './themeContext';
import ThemeSwitcher from './ThemeSwitcher..jsx';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const { themeColors } = useTheme();

  return (
    <div className={`min-h-screen ${themeColors.primaryColor} ${themeColors.fontFamily}`}>
      <header className={`${themeColors.secondaryColor} shadow-sm ${themeColors.borderClass} border-b`}>
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="BeautyAI Logo" className="h-8" />
            <h1 className={`text-xl font-medium ${themeColors.textColor}`}>BeautyAI</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className={`text-sm ${themeColors.textColor}`}>
                Witaj, {user.name}
              </div>
            )}
            <div className="relative group">
              <button className={`${themeColors.buttonClass} text-white px-3 py-1 rounded-full text-sm`}>
                Ustawienia
              </button>
              <div className="absolute right-0 mt-2 hidden group-hover:block z-10">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-6">
        {children}
      </main>
      
      <footer className={`${themeColors.secondaryColor} py-6 ${themeColors.borderClass} border-t`}>
        <div className="container mx-auto px-6 text-center">
          <p className={`text-sm ${themeColors.textColor}`}>
            &copy; {new Date().getFullYear()} BeautyAI. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
