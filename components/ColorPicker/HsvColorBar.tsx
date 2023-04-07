import React, { useCallback, useEffect, useRef } from 'react';
import styles from './ColorBar.module.css';

type Props = {
  width: number;
  startColor: string;
  endColor: string;
  percent: number;
  opacityFlag?: boolean;
  onPercentChange: (percent: number) => void;
};

const halfCircleWidth = 7.5;

function HsvColorBar({
  width,
  startColor,
  endColor,
  opacityFlag = false,
  percent,
  onPercentChange,
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

      const left = percent;
      moveCircleRef.current!.style.left = `${
        (left / 100) * width - halfCircleWidth
      }px`;
    }
  }, [startColor, endColor]);

  useEffect(() => {
    const left = percent;
    moveCircleRef.current!.style.left = `${
      (left / 100) * width - halfCircleWidth
    }px`;
  }, [percent]);

  const getColor = (left: number) => {
    let percentage = Math.floor((left / (width - 2 * halfCircleWidth)) * 100);
    if (percentage < 0) {
      percentage = 0;
    }
    if (percentage > 100) {
      percentage = 100;
    }
    onPercentChange(percentage);
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
    <div
      className={`mb-5 theme-border overflow-hidden relative ${
        opacityFlag && styles.opacityCanvas
      }`}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={20}
        onMouseDown={onCanvasMouseDown}
      />
      <div
        ref={moveCircleRef}
        className="absolute h-[20px] bg-white theme-border w-[15px] top-0 left-0 cursor-pointer"
        onMouseDown={onMoveCircleMouseDown}
      ></div>
    </div>
  );
}

export default HsvColorBar;
