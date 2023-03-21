'use client';

import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import MenuRow from './MenuRow';
import AllToolsSvg from '@/components/icons/AllToolsSvg';
import menuData from '@/data';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function Menu() {
  const [menus, setMenus] = useState<MenuItem[]>([...menuData]);

  const pathname = usePathname();
  const router = useRouter();

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
            <div className="bg-white dark:bg-slate-800 flex items-center rounded-md px-3 py-1 border-b-sky-600 dark:border-b-white/70 border-b-2">
              <input
                type="text"
                className="outline-none w-full dark:placeholder:text-white/70 dark:text-white/70 dark:bg-slate-800 "
                placeholder="Type to search for tools..."
              />
              <MagnifyingGlassIcon className="h-4 w-4 dark:text-white/70 rotate-90" />
            </div>
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
              />
              <div
                className={`pl-12 ${
                  item.expand ? 'max-h-screen' : 'max-h-0'
                } overflow-hidden transition-all duration-500 ease-in-out `}
              >
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
          ))}
        </div>
      </div>

      <div className="pl-1.5 pb-5 cursor-pointer">
        <div className="flex items-center pl-8 gap-5 text-lg">
          <div>
            <Cog6ToothIcon className="h-7 w-7" />
          </div>
          <div>Settings</div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
