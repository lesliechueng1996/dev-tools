export type HsvColorType = {
  hue: number;
  saturation: number;
  value: number;
  opacity: number;
};

export default class HsvColor {
  hue;
  saturation;
  value;
  opacity;

  constructor({ hue, saturation, value, opacity }: HsvColorType) {
    this.hue = Math.floor(hue);
    this.saturation = Math.floor(saturation);
    this.value = Math.floor(value);
    this.opacity = Math.round(opacity);
  }

  static copy(color: HsvColor) {
    return new HsvColor({
      hue: color.hue,
      saturation: color.saturation,
      value: color.value,
      opacity: color.opacity,
    });
  }

  static fromHex(argb: string) {
    let temp = argb.replace('#', '');
    const redStr = temp.substring(2, 4);
    const redValue = parseInt(redStr, 16);
    const greenStr = temp.substring(4, 6);
    const greenValue = parseInt(greenStr, 16);
    const blueStr = temp.substring(6, 8);
    const blueValue = parseInt(blueStr, 16);
    const alphaStr = temp.substring(0, 2);
    const alphaValue = parseInt(alphaStr, 16);
    const rgba = {
      r: redValue,
      g: greenValue,
      b: blueValue,
      a: alphaValue,
    };
    return this.fromRGBA(rgba);
  }

  static fromRGBA({
    r,
    g,
    b,
    a,
  }: {
    r: number;
    g: number;
    b: number;
    a: number;
  }) {
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

    return new HsvColor({ hue: h, saturation: s, value: v, opacity: a });
  }

  toRGBA(opacity?: number) {
    let h = this.hue / 360;
    let s = this.saturation / 100;
    let v = this.value / 100;

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
      a: opacity !== null && opacity !== undefined ? opacity : this.opacity,
    };
  }

  toRGBAStr() {
    const rgba = this.toRGBA();
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }

  toRGBAWithOpacity(opacity: number) {
    const rgba = this.toRGBA(opacity);
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }

  toRGBAWithVNoOpacity(newV: number) {
    const tempColor = HsvColor.copy(this);
    tempColor.value = newV;
    tempColor.opacity = 255;
    const rgba = tempColor.toRGBA();
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }

  toHex() {
    const rgba = this.toRGBA();
    const alphaHex = rgba.a.toString(16).padStart(2, '0');
    const redHex = rgba.r.toString(16).padStart(2, '0');
    const greenHex = rgba.g.toString(16).padStart(2, '0');
    const blueHex = rgba.b.toString(16).padStart(2, '0');
    return `#${alphaHex}${redHex}${greenHex}${blueHex}`.toUpperCase();
  }

  toOpacityPercent() {
    return Math.floor((this.opacity / 255) * 100);
  }
}
