'use client';

import HsvColorPicker from '@/components/ColorPicker/HsvColorPicker';
import HsvColor from '@/components/ColorPicker/HsvColor';
import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import HslColorPicker from '@/components/ColorPicker/HslColorPicker';
import ContrastRatio from '@/components/ContrastRatio';

const modeList = ['HSV', 'HSL'];

const defaultHsvTextColor = new HsvColor({
  hue: 115,
  saturation: 42,
  value: 91,
  opacity: 200,
});

const defaultHsvBgColor = new HsvColor({
  hue: 244,
  saturation: 73,
  value: 74,
  opacity: 255,
});

const luminanace = ({ r, g, b }: { r: number; g: number; b: number }) => {
  var a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const contrast = (textColor: HsvColor, bgColor: HsvColor) => {
  const textRgb = textColor.toRGBA();
  const bgRgb = bgColor.toRGBA();

  const lum1 = luminanace(textRgb);
  const lum2 = luminanace(bgRgb);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

function ColorPickerPage() {
  const [mode, setMode] = useState(modeList[0]);
  const [hsvTextColor, setHsvTextColor] = useState(defaultHsvTextColor);
  const [hsvBgColor, setHsvBgColor] = useState(defaultHsvBgColor);
  const [ratio, setRatio] = useState(() => {
    return contrast(hsvTextColor, hsvBgColor);
  });

  useEffect(() => {
    setRatio(contrast(hsvTextColor, hsvBgColor));
  }, [hsvTextColor, hsvBgColor]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Color Picker & Contrast</h1>

      <div>
        <h2 className="mb-2">Configuration</h2>
        <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
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
            backgroundColor: hsvBgColor.toRGBAStr(),
            color: hsvTextColor.toRGBAStr(),
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
        <h2 className="mb-2">Contrast ratio</h2>
        <div className="flex gap-3">
          <ContrastRatio
            className="flex-1"
            type="AA"
            size="large"
            ratio={ratio}
          />
          <ContrastRatio
            className="flex-1"
            type="AA"
            size="small"
            ratio={ratio}
          />
          <ContrastRatio
            className="flex-1"
            type="AAA"
            size="large"
            ratio={ratio}
          />
          <ContrastRatio
            className="flex-1"
            type="AAA"
            size="small"
            ratio={ratio}
          />
        </div>
      </div>

      {mode === 'HSV' ? (
        <div className="flex">
          <div className="flex-1">
            <h2 className="mb-2">Text color</h2>
            <HsvColorPicker
              width={300}
              defaultColor={hsvTextColor}
              onColorChange={(color: HsvColor) => {
                setHsvTextColor(color);
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="mb-2">Background color</h2>
            <HsvColorPicker
              width={300}
              defaultColor={hsvBgColor}
              onColorChange={(color: HsvColor) => {
                setHsvBgColor(color);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="flex-1">
            <h2 className="mb-2">Text color</h2>
            <HslColorPicker
              width={300}
              defaultColor={hsvTextColor}
              onColorChange={(color: HsvColor) => {
                setHsvTextColor(color);
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="mb-2">Background color</h2>
            <HslColorPicker
              width={300}
              defaultColor={hsvBgColor}
              onColorChange={(color: HsvColor) => {
                setHsvBgColor(color);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPickerPage;
