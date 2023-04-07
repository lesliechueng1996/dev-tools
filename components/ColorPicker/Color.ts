type ColorType = {
  hue: number;
  saturation: number;
  value: number;
  opacity: number;
  hex: string;
  red: number;
  green: number;
  blue: number;
};

type HSVAColorType = {
  hue: number;
  saturation: number;
  value: number;
  opacity: number;
};

type HSVColorType = {
  hue: number;
  saturation: number;
  value: number;
};

const rgbaToHex = ({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string => {
  let hex = '#';
  hex += r.toString(16).padStart(2, '0');
  hex += g.toString(16).padStart(2, '0');
  hex += b.toString(16).padStart(2, '0');
  a = Math.round((a / 100) * 255);
  hex += a.toString(16).padStart(2, '0');
  return hex;
};

const rgbToHSV = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const tempR = r;
  const tempB = b;
  const tempG = g;
  const max = Math.max(tempR, tempG, tempB);
  const min = Math.min(tempR, tempG, tempB);
  const d = max - min;
  let h, s, v;
  if (d === 0) {
    h = 0;
  } else if (max === tempR) {
    h = (tempG - tempB) / d + (tempG < tempB ? 6 : 0);
  } else if (max === tempG) {
    h = (tempB - tempR) / d + 2;
  } else {
    h = (tempR - tempG) / d + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }
  v = Math.round((max / 255) * 100);
  s = Math.round((max === 0 ? 0 : d / max) * 100);

  return { hue: h, saturation: s, value: v };
};

const hsvToRGB = ({ hue, saturation, value }: HSVColorType) => {
  let h = hue / 360;
  let s = saturation / 100;
  let v = value / 100;

  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return {
    r,
    g,
    b,
  };
};

export default class Color {
  hue;
  saturation;
  value;
  opacity;
  hex;
  red;
  green;
  blue;

  constructor({
    hue,
    saturation,
    value,
    opacity,
    red,
    green,
    blue,
  }: ColorType) {
    this.hue = Math.floor(hue);
    this.saturation = Math.floor(saturation);
    this.value = Math.floor(value);
    this.opacity = Math.round(opacity);
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.hex = rgbaToHex({ r: red, g: green, b: blue, a: opacity });
  }

  static fromHex(rgba: string): Color {
    let temp = rgba.replace('#', '');
    const redStr = temp.substring(0, 2);
    const redValue = parseInt(redStr, 16);
    const greenStr = temp.substring(2, 4);
    const greenValue = parseInt(greenStr, 16);
    const blueStr = temp.substring(4, 6);
    const blueValue = parseInt(blueStr, 16);
    const alphaStr = temp.substring(6, 8);
    const alphaValue = parseInt(alphaStr, 16);
    const obj = {
      r: redValue,
      g: greenValue,
      b: blueValue,
    };
    const hsv = rgbToHSV(obj);
    return new Color({
      ...hsv,
      hex: rgba,
      red: redValue,
      green: greenValue,
      blue: blueValue,
      opacity: Math.floor((alphaValue / 255) * 100),
    });
  }

  static fromHSVA({ hue, saturation, value, opacity }: HSVAColorType): Color {
    const rgb = hsvToRGB({ hue, saturation, value });
    const hex = rgbaToHex({ ...rgb, a: opacity });
    return new Color({
      hue: Math.floor(hue),
      saturation: Math.floor(saturation),
      value: Math.floor(value),
      opacity,
      red: rgb.r,
      green: rgb.g,
      blue: rgb.b,
      hex,
    });
  }

  static copy(color: ColorType): Color {
    return new Color({
      ...color,
    });
  }

  updateRgbAndHex() {
    const rgb = hsvToRGB({
      hue: this.hue,
      saturation: this.saturation,
      value: this.value,
    });
    const hex = rgbaToHex({ ...rgb, a: this.opacity });

    this.red = rgb.r;
    this.green = rgb.g;
    this.blue = rgb.b;
    this.hex = hex;
  }

  updateHex() {
    const hex = rgbaToHex({
      r: this.red,
      g: this.green,
      b: this.blue,
      a: this.opacity,
    });
    this.hex = hex;
  }

  updateHSV() {
    const hsv = rgbToHSV({
      r: this.red,
      g: this.green,
      b: this.blue,
    });
    this.hue = hsv.hue;
    this.saturation = hsv.saturation;
    this.value = hsv.value;
  }

  toRGBAWithVNoOpacity(newV: number) {
    const tempColor = Color.copy(this);
    tempColor.value = newV;
    tempColor.updateRgbAndHex();
    return `rgba(${tempColor.red}, ${tempColor.green}, ${tempColor.blue}, 1)`;
  }

  toRGBAWithOpacity(opacity: number) {
    const a = opacity / 255;
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${a})`;
  }
}
