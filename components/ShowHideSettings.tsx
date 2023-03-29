'use client';

import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import DropdownBox, { Props as DropdownBoxProps } from './DropdownBox';
import { useState } from 'react';

export type Props = {
  title: string;
  subTitle: string;
  items: DropdownBoxProps[];
};

function ShowHideSettings({ title, subTitle, items }: Props) {
  const [expand, setExpand] = useState(false);

  return (
    <div>
      <div
        className="flex items-center bg-white rounded-md py-5 px-5 shadow gap-5 h-20 group cursor-pointer"
        onClick={() => setExpand(!expand)}
      >
        <AdjustmentsHorizontalIcon className="w-6 h-6" />
        <div className="flex flex-col flex-1">
          <span className="text-md">{title}</span>
          <span className="text-sm">{subTitle}</span>
        </div>
        <div className="p-2 rounded-md group-hover:bg-slate-300/50">
          <ChevronDownIcon
            className={`w-6 h-6 ${
              expand && 'rotate-180'
            } transition-all duration-300 ease-in-out`}
          />
        </div>
      </div>
      <div
        className="bg-slate-300/50 space-y-2 grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: `${expand ? '1fr' : '0fr'}` }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className=" px-2 py-2">
            {items &&
              items.map((item) => <DropdownBox key={item.title} {...item} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowHideSettings;
