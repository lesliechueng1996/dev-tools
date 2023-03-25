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
    this.opacity = Math.floor(opacity);
  }

  static copy(color: HsvColor) {
    return new HsvColor({
      hue: color.hue,
      saturation: color.saturation,
      value: color.value,
      opacity: color.opacity,
    });
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
