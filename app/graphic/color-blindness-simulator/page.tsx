'use client';

import DragDropFile from '@/components/DragDropFile';
import { useState } from 'react';
import ImagePreview from '@/components/ImagePreview';

function protanopiaTransform(r: number, g: number, b: number) {
  var protan_r = 0.56667 * r + 0.43333 * g;
  var protan_g = 0.55833 * r + 0.44167 * g + 0.0125 * b;
  var protan_b = 0 * r + 0.24167 * g + 0.75833 * b;
  return [protan_r, protan_g, protan_b];
}

function deuteranopiaTransform(r: number, g: number, b: number) {
  var deuteran_r = 0.8 * r + 0.2 * b;
  var deuteran_g = 0.25833 * r + 0.74167 * g + 0.00833 * b;
  var deuteran_b = 0 * r + 0.14167 * g + 0.85833 * b;
  return [deuteran_r, deuteran_g, deuteran_b];
}

function tritanopiaTransform(r: number, g: number, b: number) {
  var tritan_r = 0.95 * r + 0.05 * g;
  var tritan_g = 0.0 * r + 0.43333 * g + 0.56667 * b;
  var tritan_b = 0 * g + 0.475 * b + 0.525 * r;
  return [tritan_r, tritan_g, tritan_b];
}

function ColorBlindnessSimulatorPage() {
  const [show, setShow] = useState(false);
  const [originalImageSrc, setOriginalImageSrc] = useState('');
  const [protanopiaImageSrc, setProtanopiaImageSrc] = useState('');
  const [tritanopiaImageSrc, setTritanopiaImageSrc] = useState('');
  const [deuteranopiaImageSrc, setDeuteranopiaImageSrc] = useState('');

  const generateColorBlindnessImage = (
    url: string,
    type: 'Protanopia' | 'Tritanopia' | 'Deuteranopia'
  ) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;
      if (!ctx) {
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        let [l, m, s] = [r, g, b];
        if (type === 'Protanopia') {
          [l, m, s] = protanopiaTransform(r, g, b);
        } else if (type === 'Deuteranopia') {
          [l, m, s] = deuteranopiaTransform(r, g, b);
        } else if (type === 'Tritanopia') {
          [l, m, s] = tritanopiaTransform(r, g, b);
        }
        data[i] = l;
        data[i + 1] = m;
        data[i + 2] = s;
      }
      ctx.putImageData(imageData, 0, 0);
      const targetSrc = canvas.toDataURL();
      if (type === 'Protanopia') {
        setProtanopiaImageSrc(targetSrc);
      } else if (type === 'Deuteranopia') {
        setDeuteranopiaImageSrc(targetSrc);
      } else if (type === 'Tritanopia') {
        setTritanopiaImageSrc(targetSrc);
      }
    };
    img.src = url;
  };

  const onImageUpload = (image: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const baseSrc = e.target?.result as string;
      setOriginalImageSrc(baseSrc);
      setShow(true);
      generateColorBlindnessImage(baseSrc, 'Protanopia');
      generateColorBlindnessImage(baseSrc, 'Deuteranopia');
      generateColorBlindnessImage(baseSrc, 'Tritanopia');
    };
    reader.readAsDataURL(image);
  };

  return (
    <div>
      <h1 className="text-3xl mb-5">Color Blindness Simulator</h1>
      <DragDropFile
        className="mb-5"
        acceptFiles={['.png', '.jpg', '.jpeg', '.bpm']}
        onFileLoad={onImageUpload}
      />
      {show && (
        <div className="grid grid-cols-2 grid-row-2 gap-4">
          <ImagePreview imageSrc={originalImageSrc} title="Original" />
          <ImagePreview
            imageSrc={protanopiaImageSrc}
            title="Protanopia simulation"
          />
          <ImagePreview
            imageSrc={tritanopiaImageSrc}
            title="Tritanopia simulation"
          />
          <ImagePreview
            imageSrc={deuteranopiaImageSrc}
            title="Deuteranopia simulation"
          />
        </div>
      )}
    </div>
  );
}

export default ColorBlindnessSimulatorPage;
