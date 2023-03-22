'use client';

import React, { useRef, useCallback, useState } from 'react';

type Props = {
  leftChild: JSX.Element;
  rightChild: JSX.Element;
  leftMin: number;
  rightMin: number;
};

let startX = 0;

function SplitterView({ leftChild, rightChild, leftMin, rightMin }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const leftWidthRef = useRef(50);

  const [leftWidth, setLeftWidth] = useState(50);
  const [rightWidth, setRighWidth] = useState(50);
  const lastLeft = useRef(leftWidth);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const width = rootRef.current!.clientWidth;
    const x = e.clientX - startX;

    const left = (lastLeft.current * width) / 100 + x;
    if (left <= leftMin) {
      return;
    }
    if (width - left <= rightMin) {
      return;
    }
    leftWidthRef.current = (left * 100) / width;
    setLeftWidth((left * 100) / width);
    setRighWidth(((width - left) * 100) / width);
  }, []);

  const onMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  const registerMouseMoveEvent = useCallback(
    (e: React.MouseEvent) => {
      startX = e.clientX;
      lastLeft.current = leftWidthRef.current;
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [onMouseMove, onMouseUp]
  );

  return (
    <div className="flex w-full h-full" ref={rootRef}>
      <div className="p-5" style={{ flexBasis: `calc(${leftWidth}% - 4px)` }}>
        {leftChild}
      </div>
      <div
        className="w-1 bg-gray-200/40 flex items-center cursor-col-resize active:bg-gray-300 transition-colors duration-300"
        onMouseDown={registerMouseMoveEvent}
      >
        <div className="w-1 h-8 bg-gray-300"></div>
      </div>
      <div className="p-5" style={{ flexBasis: `calc(${rightWidth}% - 4px)` }}>
        {rightChild}
      </div>
    </div>
  );
}

export default SplitterView;
