'use client';

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import LanguageDropdown from './LanguageDropdown';
import { useTheme } from './ThemeProvider';

function NavSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-5 items-center">
      <div
        className="w-10 h-10 flex justify-center items-center rounded-full border shadow cursor-pointer bg-white hover:bg-slate-900 hover:text-white transition-colors duration-300 dark:border-slate-800"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? (
          <MoonIcon className="h-6 w-6 stroke-2" />
        ) : (
          <SunIcon className="h-6 w-6 stroke-2" />
        )}
      </div>

      <LanguageDropdown />
    </div>
  );
}

export default NavSettings;
