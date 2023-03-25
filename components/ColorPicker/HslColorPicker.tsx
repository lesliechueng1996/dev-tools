'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import ColorBar from './HsvColorBar';
import HsvColor from './HsvColor';

type Props = {
  width: number;
  defaultColor: HsvColor;
  onColorChange: (rgba: string) => void;
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

  const [color, setColor] = useState<HsvColor>(HsvColor.copy(defaultColor));
  const colorRef = useRef<HsvColor>(color);

  const [mode, setMode] = useState('RGB');
  const [colorInput, setColorInput] = useState<Inputs>(() => {
    const rgba = color.toRGBA();
    return {
      hex: color.toHex(),
      red: rgba.a,
      green: rgba.g,
      blue: rgba.b,
      hue: color.hue,
      saturation: color.saturation,
      value: color.value,
      opacity: Math.floor((color.opacity * 100) / 255),
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
    const rgba = color.toRGBA();
    setColorInput({
      hex: color.toHex(),
      red: rgba.r,
      green: rgba.g,
      blue: rgba.b,
      hue: color.hue,
      saturation: color.saturation,
      value: color.value,
      opacity: Math.floor((color.opacity * 100) / 255),
    });
    onColorChange(color.toRGBAStr());
  }, [color]);

  // methods
  const setColorRef = (newColor: HsvColor) => {
    colorRef.current = newColor;
    setColor(newColor);
  };

  const setPointByHSV = (color: HsvColor) => {
    const { hue, saturation } = color;
    const x = (width * hue) / 360;
    const y = width - (width * saturation) / 100;
    moveCircleRef.current!.style.left = `calc(${x}px - ${halfCircleWidth})`;
    moveCircleRef.current!.style.top = `calc(${y}px - ${halfCircleWidth})`;
  };

  const setMoveCircieColor = (color: HsvColor) => {
    const { r, g, b } = color.toRGBA();
    const flag = 0.213 * r + 0.715 * g + 0.072 * b > 255 / 2;
    moveCircleRef.current!.style.borderColor = flag ? '#000000' : '#ffffff';
  };

  const setColorByPoint = ({ x, y }: { x: number; y: number }) => {
    const hue = (x * 360) / width;
    const saturation = 100 - (y * 100) / width;
    const { value, opacity } = colorRef.current;
    const newColor = new HsvColor({ hue, saturation, value, opacity });

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
          className={styles.colorBox}
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
            className={styles.moveCircle}
          ></div>
        </div>
        <ColorBar
          width={width}
          startColor={color?.toRGBAWithVNoOpacity(0) ?? ''}
          endColor={color?.toRGBAWithVNoOpacity(100) ?? ''}
          percent={color.value}
          onPercentChange={(percent) => {
            const newColor = new HsvColor({
              ...colorRef.current,
              value: percent,
            });
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
            const newColor = new HsvColor({
              ...colorRef.current,
              opacity: (percent / 100) * 255,
            });
            setColorRef(newColor);
          }}
        />
      </div>
      <div>
        <div className={styles.inputWrap}>
          <div className={styles.selectWrap}>
            <select
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
            className={styles.input}
            type="text"
            value={color.toHex()}
            onChange={(e) => {
              const text = e.target.value;
              if (!/^#([A-Fa-f0-9]{2}){4}$/.test(text)) {
                return;
              }

              setColorRef(HsvColor.fromHex(text));
            }}
          />
        </div>
        {mode === 'RGB' ? (
          <>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="text"
                value={colorInput.red}
                onChange={(e) => {
                  const red = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    red,
                  });
                  if (red >= 0 && red <= 255) {
                    setColorRef(
                      HsvColor.fromRGBA({
                        ...color.toRGBA(),
                        r: red,
                      })
                    );
                  }
                }}
              />
              <span className={styles.label}>Red</span>
            </div>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="text"
                value={colorInput.green}
                onChange={(e) => {
                  const green = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    green,
                  });
                  if (green >= 0 && green <= 255) {
                    setColorRef(
                      HsvColor.fromRGBA({
                        ...color.toRGBA(),
                        g: green,
                      })
                    );
                  }
                }}
              />
              <span className={styles.label}>Green</span>
            </div>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="text"
                value={colorInput.blue}
                onChange={(e) => {
                  const blue = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    blue,
                  });
                  if (blue >= 0 && blue <= 255) {
                    setColorRef(
                      HsvColor.fromRGBA({
                        ...color.toRGBA(),
                        b: blue,
                      })
                    );
                  }
                }}
              />
              <span className={styles.label}>Blue</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="text"
                value={colorInput.hue}
                onChange={(e) => {
                  const hue = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    hue,
                  });
                  if (hue >= 0 && hue < 360) {
                    setColorRef(
                      new HsvColor({
                        ...color,
                        hue,
                      })
                    );
                  }
                }}
              />
              <span className={styles.label}>Hue</span>
            </div>

            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="text"
                value={colorInput.saturation}
                onChange={(e) => {
                  const saturation = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    saturation,
                  });
                  if (saturation >= 0 && saturation <= 100) {
                    setColorRef(
                      new HsvColor({
                        ...color,
                        saturation,
                      })
                    );
                  }
                }}
              />
              <span className={styles.label}>Saturation</span>
            </div>

            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="text"
                value={colorInput.value}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setColorInput({
                    ...colorInput,
                    value,
                  });
                  if (value >= 0 && value <= 100) {
                    setColorRef(
                      new HsvColor({
                        ...color,
                        value,
                      })
                    );
                  }
                }}
              />
              <span className={styles.label}>Value</span>
            </div>
          </>
        )}
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type="text"
            value={colorInput.opacity}
            onChange={(e) => {
              const num = Number(e.target.value);
              setColorInput({
                ...colorInput,
                opacity: num,
              });
              if (num >= 0 && num <= 100) {
                setColorRef(
                  new HsvColor({
                    ...color,
                    opacity: (num / 100) * 255,
                  })
                );
              }
            }}
          />
          <span className={styles.label}>Opacity(%)</span>
        </div>
      </div>
    </div>
  );
}

export default HslColorPicker;
