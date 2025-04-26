import React from 'react';
import ThemeSwitcher from './ThemeSwitcher.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <header className="p-4 flex justify-end">
        <ThemeSwitcher />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
