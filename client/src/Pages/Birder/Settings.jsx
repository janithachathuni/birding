import React, { useState, useEffect } from 'react';
import UserSidebar from '../../Components/UserSidebar';
import { Check, Moon, Sun } from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check for saved preference or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else if (systemPrefersDark) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-800">
      <UserSidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Settings</h1>
        
        <div className="max-w-2xl bg-white dark:bg-gray-700 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Appearance</h2>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center">
              {darkMode ? (
                <Moon className="text-gray-700 dark:text-gray-300 mr-3" />
              ) : (
                <Sun className="text-gray-700 dark:text-gray-300 mr-3" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                darkMode ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Other settings options can go here */}
          <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Account Settings</h3>
            {/* Add your account settings components here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;