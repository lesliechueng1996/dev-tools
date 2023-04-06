'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React from 'react';

type Props = MenuItem & {
  onClick?: (id: string) => void;
};

function MenuRow({
  id,
  icon,
  label,
  expand,
  isLeaf,
  isActive = false,
  onClick,
}: Props) {
  return (
    <div
      className={`py-3 dark:text-white/80 ${
        isActive && 'bg-gray-300/50 dark:bg-slate-800'
      } rounded-md flex cursor-pointer`}
      onClick={() => {
        onClick && onClick(id);
      }}
    >
      <div
        className={`${
          isActive ? 'bg-sky-600 dark:bg-cyan-400' : 'bg-transparent'
        } w-1.5 rounded-lg transition-all duration-300`}
      ></div>
      <div className="flex flex-1 px-5 items-center justify-between">
        <div className="flex gap-5 items-center">
          {React.createElement(icon, { className: 'h-8 w-8' })}
          <span className="text-lg">{label}</span>
        </div>
        <div>
          {!isLeaf ? (
            expand ? (
              <ChevronUpIcon className="h-6 w-6 dark:text-white/70" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 dark:text-white/70" />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MenuRow;
