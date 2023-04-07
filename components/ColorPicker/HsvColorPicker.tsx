'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ColorBar from './HsvColorBar';
import Color from './Color';

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

function HsvColorPicker({ width, defaultColor, onColorChange }: Props) {
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
      opacity: color.opacity,
    };
  });

  // init color picker
  useEffect(() => {
    const canvas = colorBoxRef.current!;
    const ctx = canvas.getContext('2d')!;

    const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient1.addColorStop(0, '#ff0000');
    gradient1.addColorStop(0.17, '#ffff00');
    gradient1.addColorStop(0.33, '#00ff00');
    gradient1.addColorStop(0.5, '#00ffff');
    gradient1.addColorStop(0.67, '#0000fe');
    gradient1.addColorStop(0.83, '#ff00ff');
    gradient1.addColorStop(1, '#ff0000');
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient2.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient2.addColorStop(1, 'rgba(255, 255, 255, 1)');
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setPointByHSV(color);
    setMoveCircieColor(color);
  }, []);

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
      opacity: color.opacity,
    });
    onColorChange(color);
  }, [color]);

  // methods
  const setColorRef = (newColor: Color) => {
    colorRef.current = newColor;
    setColor(newColor);
  };

  const setPointByHSV = (color: Color) => {
    const { hue, saturation } = color;
    const x = (width * hue) / 360;
    const y = width - (width * saturation) / 100;
    moveCircleRef.current!.style.left = `calc(${x}px - ${halfCircleWidth})`;
    moveCircleRef.current!.style.top = `calc(${y}px - ${halfCircleWidth})`;
  };

  const setMoveCircieColor = (color: Color) => {
    const { red, green, blue } = color;
    const flag = 0.213 * red + 0.715 * green + 0.072 * blue > 255 / 2;
    moveCircleRef.current!.style.borderColor = flag ? '#000000' : '#ffffff';
  };

  const setColorByPoint = ({ x, y }: { x: number; y: number }) => {
    const hue = (x * 360) / width;
    const saturation = 100 - (y * 100) / width;
    const { value, opacity } = colorRef.current;
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
        <ColorBar
          width={width}
          startColor={color?.toRGBAWithVNoOpacity(0) ?? ''}
          endColor={color?.toRGBAWithVNoOpacity(100) ?? ''}
          percent={color.value}
          onPercentChange={(percent) => {
            const newValue = percent;
            const newColor = new Color({
              ...colorRef.current,
              value: newValue,
            });
            newColor.updateRgbAndHex();
            setColorRef(newColor);
          }}
        />
        <ColorBar
          width={width}
          startColor={color?.toRGBAWithOpacity(0) ?? ''}
          endColor={color?.toRGBAWithOpacity(255) ?? ''}
          opacityFlag
          percent={color.opacity}
          onPercentChange={(percent) => {
            const newColor = new Color({
              ...colorRef.current,
              opacity: percent,
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
              className="theme-bg"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
              }}
            >
              <option value="RGB">RGB</option>
              <option value="HSV">HSV</option>
            </select>
          </div>
          <input
            className="theme-border outline-none flex-1 px-2 py-3 theme-bg"
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
                className="theme-border outline-none flex-1 px-2 py-3 theme-bg"
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
                className="theme-border outline-none flex-1 px-2 py-3 theme-bg"
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
                className="theme-border outline-none flex-1 px-2 py-3 theme-bg"
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
                className="theme-border outline-none flex-1 px-2 py-3 theme-bg"
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
                className="theme-border outline-none flex-1 px-2 py-3 theme-bg"
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
                className="theme-border outline-none flex-1 px-2 py-3 theme-bg"
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
            className="theme-border outline-none flex-1 px-2 py-3 theme-bg"
            type="text"
            value={colorInput.opacity}
            onChange={(e) => {
              const num = Number(e.target.value);
              setColorInput({
                ...colorInput,
                opacity: num,
              });
              if (num >= 0 && num <= 100) {
                const newColor = new Color({
                  ...color,
                  opacity: num,
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

export default HsvColorPicker;
