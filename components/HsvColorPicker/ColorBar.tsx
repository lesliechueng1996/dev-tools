import React, { useCallback, useEffect, useRef } from 'react';
import styles from './ColorBar.module.css';

type Props = {
  width: number;
  startColor: string;
  endColor: string;
  opacityFlag?: boolean;
  onColorChange?: (color: ImageData) => void;
  onOpacityChange?: (opacity: number) => void;
};

function ColorBar({
  width,
  startColor,
  endColor,
  opacityFlag = false,
  onColorChange,
  onOpacityChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moveCircleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startColor && endColor) {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, endColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [startColor, endColor]);

  const getColor = (left: number) => {
    const circleWidth = moveCircleRef.current!.getBoundingClientRect().width;
    if (opacityFlag) {
      if (left >= width - circleWidth) {
        onOpacityChange && onOpacityChange(255);
        return;
      }
      if (left <= 0) {
        onOpacityChange && onOpacityChange(0);
        return;
      }
      onOpacityChange &&
        onOpacityChange(Math.floor((left / (width - circleWidth)) * 255));
      return;
    }

    let realLeft;
    if (left >= width - circleWidth) {
      realLeft = 300;
    } else if (left <= 0) {
      realLeft = 0;
    } else {
      realLeft = left;
    }

    const color = canvasRef
      .current!.getContext('2d')!
      .getImageData(realLeft, 0, 1, 1);
    onColorChange && onColorChange(color);
  };

  const onMouseMoveOnColorBar = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();

    const moveX = e.clientX - rect.left;

    const circleWidth =
      moveCircleRef.current!.getBoundingClientRect().width / 2;
    if (moveX >= circleWidth - 1 && moveX < width - circleWidth) {
      moveCircleRef.current!.style.left = `calc(${moveX}px - ${circleWidth}px)`;
    }

    getColor(moveCircleRef.current!.offsetLeft);
  }, []);

  const onMouseUpOnColorBar = useCallback(() => {
    window.removeEventListener('mousemove', onMouseMoveOnColorBar);
    window.removeEventListener('mouseup', onMouseUpOnColorBar);
  }, []);

  const onMoveCircleMouseDown = useCallback(() => {
    window.addEventListener('mousemove', onMouseMoveOnColorBar);
    window.addEventListener('mouseup', onMouseUpOnColorBar);
  }, []);

  const onCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const circleWidth =
        moveCircleRef.current!.getBoundingClientRect().width / 2;
      moveCircleRef.current!.style.left = `calc(${
        e.clientX - rect.left
      }px - ${circleWidth}px)`;

      getColor(moveCircleRef.current!.offsetLeft);

      window.addEventListener('mousemove', onMouseMoveOnColorBar);
      window.addEventListener('mouseup', onMouseUpOnColorBar);
    },
    []
  );

  return (
    <div className={`${styles.box} ${opacityFlag && styles.opacityCanvas}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={20}
        onMouseDown={onCanvasMouseDown}
      />
      <div
        ref={moveCircleRef}
        className={styles.moveCircle}
        onMouseDown={onMoveCircleMouseDown}
      ></div>
    </div>
  );
}

export default ColorBar;
