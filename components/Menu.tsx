'use client';

import React, { useCallback, useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import MenuRow from './MenuRow';
import AllToolsSvg from '@/components/icons/AllToolsSvg';
import menuData from '@/data';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Suggestion from './Suggestion';

function Menu() {
  const [menus, setMenus] = useState<MenuItem[]>([...menuData]);

  const pathname = usePathname();
  const router = useRouter();

  const searchSuggestion = useCallback((data: MenuItem[], keyword: string) => {
    let suggestions: SuggestionItem[] = [];
    let lowerKeyword = keyword.toLowerCase();
    for (let i = 0; i < data.length; i++) {
      suggestions = suggestions.concat(
        data[i].children
          ?.filter((item) => {
            return (
              item.name?.toLowerCase().includes(lowerKeyword) ||
              item.label.toLowerCase().includes(lowerKeyword)
            );
          })
          ?.map((item) => ({
            id: item.id,
            text: item.name ?? '',
            link: item.link ?? '/',
          })) ?? []
      );
    }
    return suggestions;
  }, []);

  const clickMenu = (id: string) => {
    let index = menus.findIndex((menu) => menu.id === id);
    let copy = [];
    const menu = menus[index];

    for (let i = 0; i < menus.length; i++) {
      if (i === index) {
        copy.push({
          ...menus[i],
          expand: !menus[i].expand,
        });
      } else {
        copy.push(menus[i]);
      }
    }
    setMenus(copy);
    router.push(menu.link ?? '/');
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="px-2 mb-3">
          <div className="w-full pt-5 px-5 mb-5">
            <Suggestion
              data={menuData}
              searchFun={searchSuggestion}
              onChoose={(suggestion: SuggestionItem) => {
                router.push(suggestion.link);
              }}
              onSeeAll={(suggestions: SuggestionItem[]) => {
                const params = suggestions
                  .map((suggestion) => `id=${suggestion.id}`)
                  .join('&');
                router.push(`/search?${params}`);
              }}
            />
          </div>

          <Link href="/">
            <MenuRow
              id="id"
              icon={AllToolsSvg}
              label="All tools"
              isLeaf={true}
              isActive={pathname === '/'}
            />
          </Link>
        </div>

        <div className="border-t-2 border-t-gray-300/50 dark:border-t-white/20 px-2 pt-2">
          {menus.map((item) => (
            <div key={item.id}>
              <MenuRow
                id={item.id}
                icon={item.icon}
                label={item.label}
                isLeaf={false}
                expand={item.expand}
                onClick={clickMenu}
                isActive={pathname === item.link}
              />
              <div
                className={`pl-12 grid transition-all duration-500 ease-in-out`}
                style={{ gridTemplateRows: `${item.expand ? '1fr' : '0fr'}` }}
              >
                <div className="min-h-0 overflow-hidden">
                  {item.children?.map((subItem) => (
                    <Link href={subItem.link ?? '/'} key={subItem.id}>
                      <MenuRow
                        id={subItem.id}
                        icon={subItem.icon}
                        label={subItem.label}
                        isLeaf
                        expand={false}
                        isActive={pathname === subItem.link}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link href="/settings">
        <div className="pl-1.5 pb-5 cursor-pointer">
          <div className="flex items-center pl-8 gap-5 text-lg">
            <div>
              <Cog6ToothIcon className="h-7 w-7" />
            </div>
            <div>Settings</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Menu;
