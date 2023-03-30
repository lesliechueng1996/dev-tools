'use client';

import Switch from 'react-switch';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import PasteInput from '@/components/PasteInput';
import { useState } from 'react';
import JwtDateTime, { JwtDateTimeType } from './JwtDateTime';

export type SwitchValueProp = {
  textValue: string;
  flagValue: boolean;
};

export type SwitchDateProp = {
  textValue: JwtDateTimeType;
  flagValue: boolean;
};

export type Props = {
  title: string;
  subTitle?: string;
  icon: JSX.Element;
  hasItem: boolean;
  type: 'select' | 'switch';
  value: string | SwitchValueProp | SwitchDateProp;
  onValueChange: (value: string | SwitchValueProp | SwitchDateProp) => void;
  subType?: 'input' | 'date';
  // select
  options?: string[];
};
function DropdownBox({
  title,
  subTitle,
  icon,
  hasItem,
  type,
  subType = 'input',
  value,
  onValueChange,
  options = [],
}: Props) {
  const [expand, setExpand] = useState(false);

  return (
    <div className="border-2 bg-slate-300/80 rounded-md overflow-hidden">
      <div
        className={`flex items-center bg-white py-5 px-5 shadow gap-5 h-20 ${
          hasItem && 'group cursor-pointer'
        }`}
        onClick={() => setExpand(!expand)}
      >
        <div>{icon}</div>
        <div className="flex-1">{title}</div>
        <div>
          {type === 'select' ? (
            <div className="px-3 py-2 shadow border rounded-md">
              <select
                value={value as string}
                onChange={(e) => onValueChange(e.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span>{value ? 'On' : 'Off'}</span>
              <Switch
                checked={(value as SwitchValueProp).flagValue}
                onChange={(checked) => {
                  onValueChange({
                    ...(value as SwitchValueProp),
                    flagValue: checked,
                  });
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#0369A1"
              />
            </div>
          )}
        </div>
        {hasItem && (
          <div className="p-2 rounded-md group-hover:bg-slate-300/50">
            <ChevronDownIcon
              className={`w-6 h-6 ${
                expand && 'rotate-180'
              } transition-all duration-300 ease-in-out`}
            />
          </div>
        )}
      </div>
      {hasItem && (
        <div
          className="grid transition-all duration-300 ease-in-out"
          style={{ gridTemplateRows: `${expand ? '1fr' : '0fr'}` }}
        >
          {subType === 'input' && (
            <PasteInput
              className="min-h-0 overflow-hidden"
              title={subTitle ?? ''}
              value={(value as SwitchValueProp).textValue}
              onValueChange={(text) => {
                const tempValue = value as SwitchValueProp;
                onValueChange({
                  ...tempValue,
                  textValue: text,
                });
              }}
            />
          )}
          {subType === 'date' && (
            <JwtDateTime
              className="min-h-0 overflow-hidden"
              value={(value as SwitchDateProp).textValue}
              onValueChange={(text) => {
                const tempValue = value as SwitchDateProp;
                onValueChange({
                  ...tempValue,
                  textValue: text,
                });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DropdownBox;
