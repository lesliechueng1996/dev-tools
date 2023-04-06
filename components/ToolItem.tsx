'use client';

import React from 'react';
import {
  Square2StackIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useFavorite } from './FavoriteProvider';

function ToolItem({ tool }: { tool: MenuItem }) {
  const router = useRouter();
  const { favorites, addToFavorite, removeFromFavorite } = useFavorite();

  return (
    <div
      className="group flex flex-col items-center rounded-md theme-bg dark:border-slate-700 w-48 h-80 overflow-hidden shadow-md border hover:scale-110 transition-all duration-300 cursor-pointer"
      onClick={() => {
        router.push(tool.link ?? '/');
      }}
    >
      <div className="mt-10 mb-10">
        <div>{React.createElement(tool.icon, { className: 'h-20 w-20' })}</div>
      </div>
      <div className="px-3 h-56 flex-1 overflow-hidden">
        <h3 className="text-[14px] font-bold mb-1">{tool.name}</h3>
        <p className="text-[13px]">{tool.description}</p>
      </div>
      <div className="group-hover:opacity-100 opacity-0 flex w-20 mx-auto items-center justify-around my-3 transition-opacity duration-300 h-6">
        <Square2StackIcon
          className="h-6 w-6 cursor-pointer"
          title="Open in a new window"
          onClick={(e) => {
            e.stopPropagation();
            window.open(tool.link);
          }}
        />
        {favorites.includes(tool.id) ? (
          <BookmarkSlashIcon
            className="h-6 w-6 cursor-pointer"
            title="Remove from favorites"
            onClick={(e) => {
              e.stopPropagation();
              removeFromFavorite(tool.id);
            }}
          />
        ) : (
          <BookmarkIcon
            className="h-6 w-6 cursor-pointer"
            title="Add to favorites"
            onClick={(e) => {
              e.stopPropagation();
              addToFavorite(tool.id);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ToolItem;
