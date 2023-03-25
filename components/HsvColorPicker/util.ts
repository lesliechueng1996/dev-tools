export const rgbToHsv = (r: number, g: number, b: number) => {
  // 将 RGB 值转换为范围在 0 到 1 之间的值
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // 计算最小值和最大值
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  // 计算色调
  let h = 0;
  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = ((g - b) / (max - min)) % 6;
  } else if (max === g) {
    h = (b - r) / (max - min) + 2;
  } else if (max === b) {
    h = (r - g) / (max - min) + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }

  // 计算饱和度
  const s = max === 0 ? 0 : (max - min) / max;

  // 计算亮度
  const v = max;

  return { h, s, v };
};
