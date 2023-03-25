'use client';

import HsvColorPicker from '@/components/ColorPicker/HsvColorPicker';
import HsvColor from '@/components/ColorPicker/HsvColor';
import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const modeList = ['HSV', 'HSL'];

const defaultHsvTextColor = new HsvColor({
  hue: 107,
  saturation: 56,
  value: 100,
  opacity: 200,
});

const defaultHsvBgColor = new HsvColor({
  hue: 244,
  saturation: 70,
  value: 100,
  opacity: 255,
});

function ColorPickerPage() {
  const [mode, setMode] = useState(modeList[0]);
  const [hsvTextColor, setHsvTextColor] = useState(
    defaultHsvTextColor.toRGBAStr()
  );
  const [hsvBgColor, setHsvBgColor] = useState(defaultHsvBgColor.toRGBAStr());
  const [hslTextColor, setHslTextColor] = useState('');
  const [hslBgColor, setHslBgColor] = useState('');

  return (
    <div>
      <h1 className="text-3xl mb-5">Color Picker & Contrast</h1>

      <div>
        <h2 className="mb-2">Configuration</h2>
        <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 mb-5 h-20">
          <div>
            <PaintBrushIcon className="w-6 h-6" />
          </div>
          <span className="flex-1">Mode</span>
          <div className="px-3 py-2 shadow border rounded-md">
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              {modeList.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-2">Selected color</h2>
        <div
          className="rounded-md flex flex-col justify-center items-center py-5"
          style={{
            backgroundColor: `${mode === 'HSV' ? hsvBgColor : ''}`,
            color: `${mode === 'HSV' ? hsvTextColor : ''}`,
          }}
        >
          <h3 className="text-xl">Lorem ipsum dolor</h3>
          <p>
            Sit kasd feugait takimata in eirmod sadipscing sanctus consectetuer
            voluptua dolor dolor dolore rebum.
          </p>
        </div>
      </div>

      <div>
        <h2>Contrast ratio</h2>
        <div>{/* Contrast ratio */}</div>
      </div>

      {mode === 'HSV' ? (
        <div className="flex">
          <div className="flex-1">
            <h2 className="mb-3">Text color</h2>
            <HsvColorPicker
              width={300}
              defaultColor={defaultHsvTextColor}
              onColorChange={(rgba: string) => {
                setHsvTextColor(rgba);
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="mb-3">Background color</h2>
            <HsvColorPicker
              width={300}
              defaultColor={defaultHsvBgColor}
              onColorChange={(rgba: string) => {
                setHsvBgColor(rgba);
              }}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default ColorPickerPage;
