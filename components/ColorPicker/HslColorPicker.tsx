'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ColorBar from './HsvColorBar';
import Color from './Color';
import HslColorBar from './HslColorBar';

type Props = {
  width: number;
  defaultColor: Color;
  onColorChange: (color: Color) => void;
};

type Inputs = {
  hex: string;
  red: number;
  green: number;
  blue: number;
  hue: number;
  saturation: number;
  value: number;
  opacity: number;
};

const halfCircleWidth = '0.5rem';

function HslColorPicker({ width, defaultColor, onColorChange }: Props) {
  const colorBoxRef = useRef<HTMLCanvasElement>(null);
  const moveCircleRef = useRef<HTMLDivElement>(null);

  const [color, setColor] = useState<Color>(defaultColor);
  const colorRef = useRef<Color>(color);

  const [mode, setMode] = useState('RGB');
  const [colorInput, setColorInput] = useState<Inputs>(() => {
    return {
      hex: color.hex,
      red: color.red,
      green: color.green,
      blue: color.blue,
      hue: color.hue,
      saturation: color.saturation,
      value: color.value,
      opacity: Math.floor((color.opacity * 100) / 255),
    };
  });

  useEffect(() => {
    const canvas = colorBoxRef.current!;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient1.addColorStop(0, '#ffffff');
    const temp = Color.copy(color);
    temp.saturation = 100;
    temp.value = 100;
    temp.updateRgbAndHex();
    gradient1.addColorStop(1, temp.toRGBAWithOpacity(255));
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient2.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient2.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [color.hue]);

  useEffect(() => {
    setPointByHSV(color);
    setMoveCircieColor(color);
    setColorInput({
      hex: color.hex,
      red: color.red,
      green: color.green,
      blue: color.blue,
      hue: color.hue,
      saturation: color.saturation,
      value: color.value,
      opacity: Math.floor((color.opacity * 100) / 255),
    });
    onColorChange(color);
  }, [color]);

  // methods
  const setColorRef = (newColor: Color) => {
    colorRef.current = newColor;
    setColor(newColor);
  };

  const setPointByHSV = (color: Color) => {
    const { saturation, value } = color;
    const x = (width * saturation) / 100;
    const y = width - (width * value) / 100;
    moveCircleRef.current!.style.left = `calc(${x}px - ${halfCircleWidth})`;
    moveCircleRef.current!.style.top = `calc(${y}px - ${halfCircleWidth})`;
  };

  const setMoveCircieColor = (color: Color) => {
    const flag =
      0.213 * color.red + 0.715 * color.green + 0.072 * color.blue > 255 / 2;
    moveCircleRef.current!.style.borderColor = flag ? '#000000' : '#ffffff';
  };

  const setColorByPoint = ({ x, y }: { x: number; y: number }) => {
    const saturation = (x / width) * 100;
    const value = 100 - (y / width) * 100;

    const { hue, opacity } = colorRef.current;
    const newColor = Color.fromHSVA({ hue, saturation, value, opacity });

    setMoveCircieColor(newColor);
    setColorRef(newColor);
  };

  const setColorByClick = (mouseY: number, mouseX: number, rect: DOMRect) => {
    let y = mouseY - rect.top;
    if (y < 0) {
      y = 0;
    } else if (y >= width) {
      y = width - 1;
    }

    let x = mouseX - rect.left;
    if (x < 0) {
      x = 0;
    } else if (x >= width) {
      x = width - 1;
    }

    setColorByPoint({ x, y });
  };

  const onMouseMoveOnColorBox = useCallback((e: MouseEvent) => {
    const rect = colorBoxRef.current!.getBoundingClientRect();

    const moveY = e.clientY - rect.top;
    const moveX = e.clientX - rect.left;

    if (moveY >= 0 && moveY < width) {
      moveCircleRef.current!.style.top = `calc(${moveY}px - 0.5rem)`;
    }

    if (moveX >= 0 && moveX < width) {
      moveCircleRef.current!.style.left = `calc(${moveX}px - 0.5rem)`;
    }

    setColorByClick(e.clientY, e.clientX, rect);
  }, []);

  const onMouseUpOnColorBox = useCallback(() => {
    window.removeEventListener('mousemove', onMouseMoveOnColorBox);
    window.removeEventListener('mouseup', onMouseUpOnColorBox);
  }, []);

  const onCircleMouseDown = useCallback(() => {
    window.addEventListener('mousemove', onMouseMoveOnColorBox);
    window.addEventListener('mouseup', onMouseUpOnColorBox);
  }, []);

  const onColorBoxMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = colorBoxRef.current!.getBoundingClientRect();
      moveCircleRef.current!.style.top = `calc(${
        e.clientY - rect.top
      }px - 0.5rem)`;
      moveCircleRef.current!.style.left = `calc(${
        e.clientX - rect.left
      }px - 0.5rem)`;

      setColorByClick(e.clientY, e.clientX, rect);

      window.addEventListener('mousemove', onMouseMoveOnColorBox);
      window.addEventListener('mouseup', onMouseUpOnColorBox);
    },
    []
  );

  return (
    <div style={{ width: `${width}px` }}>
      <div>
        <div
          className="relative theme-border overflow-hidden mb-5"
          style={{ width: `${width}px`, height: `${width}px` }}
        >
          <canvas
            ref={colorBoxRef}
            width={width}
            height={width}
            onMouseDown={onColorBoxMouseDown}
          />
          <div
            ref={moveCircleRef}
            onMouseDown={onCircleMouseDown}
            className="absolute top-0 left-0 bg-transparent w-4 h-4 border-black rounded-full border-[2.5px] cursor-move"
          ></div>
        </div>
        <HslColorBar
          width={width}
          percent={Math.floor((color.hue / 360) * 100)}
          onPercentChange={(percent) => {
            const hue = Math.floor((percent / 100) * 360);

            const newColor = new Color({
              ...colorRef.current,
              hue,
            });
            newColor.updateRgbAndHex();
            console.log(1, newColor.toRGBAWithOpacity(255));
            setColorRef(newColor);
          }}
        />
        <ColorBar
          width={width}
          startColor={color?.toRGBAWithOpacity(0) ?? ''}
          endColor={color?.toRGBAWithOpacity(255) ?? ''}
          opacityFlag
          percent={Math.floor((color.opacity * 100) / 255)}
          onPercentChange={(percent) => {
            const newColor = new Color({
              ...colorRef.current,
              opacity: (percent / 100) * 255,
            });
            newColor.updateHex();
            setColorRef(newColor);
          }}
        />
      </div>
      <div>
        <div className="flex gap-3 items-center mb-3">
          <div className="theme-border px-2 py-3 theme-bg">
            <select
              value={mode}
              className="theme-bg"
              onChange={(e) => {
                setMode(e.target.value);
              }}
            >
              <option value="RGB">RGB</option>
              <option value="HSV">HSV</option>
            </select>
          </div>
          <input
            className="theme-border outline-none px-2 py-3 flex-1 theme-bg"
            type="text"
            value={colorInput.hex}
            onChange={(e) => {
              const text = e.target.value;
              setColorInput({
                ...colorInput,
                hex: text,
              });
              if (!/^#([A-Fa-f0-9]{2}){4}$/.test(text)) {
                return;
              }

              setColorRef(Color.fromHex(text));
            }}
          />
        </div>
        {mode === 'RGB' ? (
          <>
            <div className="flex gap-3 items-center mb-3">
              <input
                className="theme-border outline-none px-2 py-3 flex-1 theme-bg"
                type="text"
                value={colorInput.red}
                onChange={(e) => {
                  const red = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    red,
                  });
                  if (red >= 0 && red <= 255) {
                    const newColor = new Color({
                      ...color,
                      red,
                    });
                    newColor.updateHSV();
                    newColor.updateHex();
                    setColorRef(newColor);
                  }
                }}
              />
              <span className="flex-1">Red</span>
            </div>
            <div className="flex gap-3 items-center mb-3">
              <input
                className="theme-border outline-none px-2 py-3 flex-1 theme-bg"
                type="text"
                value={colorInput.green}
                onChange={(e) => {
                  const green = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    green,
                  });
                  if (green >= 0 && green <= 255) {
                    const newColor = new Color({
                      ...color,
                      green,
                    });
                    newColor.updateHSV();
                    newColor.updateHex();
                    setColorRef(newColor);
                  }
                }}
              />
              <span className="flex-1">Green</span>
            </div>
            <div className="flex gap-3 items-center mb-3">
              <input
                className="theme-border outline-none px-2 py-3 flex-1 theme-bg"
                type="text"
                value={colorInput.blue}
                onChange={(e) => {
                  const blue = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    blue,
                  });
                  if (blue >= 0 && blue <= 255) {
                    const newColor = new Color({
                      ...color,
                      blue,
                    });
                    newColor.updateHSV();
                    newColor.updateHex();
                    setColorRef(newColor);
                  }
                }}
              />
              <span className="flex-1">Blue</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-3 items-center mb-3">
              <input
                className="theme-border outline-none px-2 py-3 flex-1 theme-bg"
                type="text"
                value={colorInput.hue}
                onChange={(e) => {
                  const hue = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    hue,
                  });
                  if (hue >= 0 && hue < 360) {
                    const newColor = new Color({
                      ...color,
                      hue,
                    });
                    newColor.updateRgbAndHex();
                    setColorRef(newColor);
                  }
                }}
              />
              <span className="flex-1">Hue</span>
            </div>

            <div className="flex gap-3 items-center mb-3">
              <input
                className="theme-border outline-none px-2 py-3 flex-1 theme-bg"
                type="text"
                value={colorInput.saturation}
                onChange={(e) => {
                  const saturation = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    saturation,
                  });
                  if (saturation >= 0 && saturation <= 100) {
                    const newColor = new Color({
                      ...color,
                      saturation,
                    });
                    newColor.updateRgbAndHex();
                    setColorRef(newColor);
                  }
                }}
              />
              <span className="flex-1">Saturation</span>
            </div>

            <div className="flex gap-3 items-center mb-3">
              <input
                className="theme-border outline-none px-2 py-3 flex-1 theme-bg"
                type="text"
                value={colorInput.value}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    value,
                  });
                  if (value >= 0 && value <= 100) {
                    const newColor = new Color({
                      ...color,
                      value,
                    });
                    newColor.updateRgbAndHex();
                    setColorRef(newColor);
                  }
                }}
              />
              <span className="flex-1">Value</span>
            </div>
          </>
        )}
        <div className="flex gap-3 items-center mb-3">
          <input
            className="theme-border outline-none px-2 py-3 flex-1 theme-bg"
            type="text"
            value={colorInput.opacity}
            onChange={(e) => {
              const num = Number(e.target.value);
              setColorInput({
                ...colorInput,
                opacity: num,
              });
              if (num >= 0 && num <= 100) {
                const newOpacity = (num / 100) * 255;
                const newColor = new Color({
                  ...color,
                  opacity: newOpacity,
                });
                newColor.updateHex();
                setColorRef(newColor);
              }
            }}
          />
          <span className="flex-1">Opacity(%)</span>
        </div>
      </div>
    </div>
  );
}

export default HslColorPicker;
