'use client';

import { useCallback, useEffect, useRef } from 'react';
import styles from './style.module.css';

type Props = {
  width: number;
};

function HsvColorPicker({ width }: Props) {
  const colorBoxRef = useRef<HTMLCanvasElement>(null);
  const moveCircleRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const valueCanvasRef = useRef<HTMLCanvasElement>(null);
  const opacityCanvasRef = useRef<HTMLCanvasElement>(null);

  const getColor = (mouseX: number, mouseY: number, rect: DOMRect) => {
    let y = mouseX - rect.top;
    if (y < 0) {
      y = 0;
    } else if (y >= width) {
      y = width - 1;
    }

    let x = mouseY - rect.left;
    if (x < 0) {
      x = 0;
    } else if (x >= width) {
      x = width - 1;
    }

    const color = ctxRef.current!.getImageData(x, y, 1, 1);
    return color;
  };

  const reDrawValueCanvas = (color: ImageData) => {
    const valueCanvas = valueCanvasRef.current!;
    const valueCtx = valueCanvas.getContext('2d')!;

    valueCtx.clearRect(0, 0, valueCanvas.width, valueCanvas.height);
    const valueGradient = valueCtx.createLinearGradient(
      0,
      0,
      valueCanvas.width,
      0
    );
    valueGradient.addColorStop(0, '#000000');
    valueGradient.addColorStop(
      1,
      `rgb(${color.data[0]}, ${color.data[1]}, ${color.data[2]})`
    );
    valueCtx.fillStyle = valueGradient;
    valueCtx.fillRect(0, 0, valueCanvas.width, valueCanvas.height);
  };

  const reDrawOpacityCanvas = (color: ImageData) => {
    const canvas = opacityCanvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(
      0,
      `rgba(${color.data[0]}, ${color.data[1]}, ${color.data[2]}, 255)`
    );
    gradient.addColorStop(
      1,
      `rgba(${color.data[0]}, ${color.data[1]}, ${color.data[2]}, 0)`
      // `rgba(0, 0, 0, 0)`
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = colorBoxRef.current!;
    const rect = canvas.getBoundingClientRect();
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

    ctxRef.current = ctx;

    const color = getColor(rect.top, rect.left, rect);
    reDrawValueCanvas(color);
    reDrawOpacityCanvas(color);
  }, []);

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

    const color = getColor(e.clientY, e.clientX, rect);
    reDrawValueCanvas(color);
    reDrawOpacityCanvas(color);
  }, []);

  const onMouseUpOnColorBox = useCallback(() => {
    window.removeEventListener('mousemove', onMouseMoveOnColorBox);
    window.removeEventListener('mouseup', onMouseUpOnColorBox);
  }, []);

  const onCircleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      window.addEventListener('mousemove', onMouseMoveOnColorBox);
      window.addEventListener('mouseup', onMouseUpOnColorBox);
    },
    []
  );

  const onColorBoxMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = colorBoxRef.current!.getBoundingClientRect();
      moveCircleRef.current!.style.top = `calc(${
        e.clientY - rect.top
      }px - 0.5rem)`;
      moveCircleRef.current!.style.left = `calc(${
        e.clientX - rect.left
      }px - 0.5rem)`;
      const color = getColor(e.clientY, e.clientX, rect);
      reDrawValueCanvas(color);
      reDrawOpacityCanvas(color);
      window.addEventListener('mousemove', onMouseMoveOnColorBox);
      window.addEventListener('mouseup', onMouseUpOnColorBox);
    },
    []
  );

  return (
    <div>
      <div style={{ width: `${width}px` }}>
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
        <div className={styles.valueBox}>
          <canvas ref={valueCanvasRef} width={width} height={20} />
        </div>
        <div className={styles.opacityBox}>
          <canvas ref={opacityCanvasRef} width={width} height={20} />
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default HsvColorPicker;
