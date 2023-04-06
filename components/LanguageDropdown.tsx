'use client';

import { LanguageIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

const supportLanguages = [
  {
    key: 'en-US',
    label: 'English',
  },
  {
    key: 'zh-CN',
    label: '简体中文',
  },
];

function LanguageDropdown() {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const prefer = window.localStorage.getItem('language');
    return prefer ?? 'en-US';
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const hideMenuTimer = useRef<NodeJS.Timeout | null>(null);

  const findLabelByKey = (key: string) => {
    return supportLanguages.find((item) => item.key === key)?.label;
  };

  const changeLanguage = (key: string) => {
    setCurrentLanguage(key);
    // TODO change language
  };

  return (
    <div
      className="relative"
      onMouseOver={() => {
        if (hideMenuTimer.current) {
          clearTimeout(hideMenuTimer.current);
          hideMenuTimer.current = null;
        }
        setShowDropdown(true);
      }}
      onMouseOut={() => {
        hideMenuTimer.current = setTimeout(() => {
          setShowDropdown(false);
        }, 300);
      }}
    >
      <button className="flex gap-2 items-center border bg-white shadow rounded-md py-2 px-3 group dark:text-white/70 dark:bg-slate-800 dark:border-slate-800">
        <LanguageIcon className="w-6 h-6" />
        <span>{findLabelByKey(currentLanguage)}</span>
        <ChevronDownIcon className="w-6 h-6 group-hover:rotate-180 transition-transform duration-100" />
      </button>
      <ul
        onMouseOver={() => {
          if (hideMenuTimer.current) {
            clearTimeout(hideMenuTimer.current);
            hideMenuTimer.current = null;
          }
        }}
        onMouseOut={() => {
          setShowDropdown(false);
          hideMenuTimer.current = null;
        }}
        className={`${
          showDropdown ? 'block' : 'hidden'
        } absolute bg-theme border shadow rounded-md px-2 py-2 w-full dark:text-white/70 dark:bg-slate-800 dark:border-slate-800`}
      >
        {supportLanguages.map((item) => (
          <li
            key={item.key}
            className="p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md dark:border-slate-800"
            onClick={() => changeLanguage(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LanguageDropdown;
