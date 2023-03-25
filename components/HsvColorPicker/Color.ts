type ColorType = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const defaultColor = {
  r: 0,
  g: 0,
  b: 0,
  a: 255,
};

export default class Color {
  r;
  g;
  b;
  a;

  constructor({ r, g, b, a }: ColorType) {
    if (
      r < 0 ||
      r > 255 ||
      b < 0 ||
      b > 255 ||
      g < 0 ||
      g > 255 ||
      a < 0 ||
      a > 255
    ) {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 255;
      return;
    }
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static fromHex(argb: string) {
    if (!argb || !/^#([A-Fa-f0-9]{2}){4}$/.test(argb)) {
      return new Color(defaultColor);
    }
    let temp = argb.replace('#', '');
    const redStr = temp.substring(2, 4);
    const redValue = parseInt(redStr, 16);
    const greenStr = temp.substring(4, 6);
    const greenValue = parseInt(greenStr, 16);
    const blueStr = temp.substring(6, 8);
    const blueValue = parseInt(blueStr, 16);
    const alphaStr = temp.substring(0, 2);
    const alphaValue = parseInt(alphaStr, 16);
    return new Color({
      r: redValue,
      g: greenValue,
      b: blueValue,
      a: alphaValue,
    });
  }

  static fromHSV({
    h,
    s,
    v,
    a,
  }: {
    h: number;
    s: number;
    v: number;
    a: number;
  }) {
    h = h / 360;
    s = s / 100;
    v = v / 100;

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

    return new Color({
      r,
      g,
      b,
      a,
    });
  }

  toHSV() {
    const tempR = this.r;
    const tempB = this.b;
    const tempG = this.g;
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

    return { h, s, v, a: this.a };
  }

  toRGBA(opacity?: number) {
    if (
      opacity === null ||
      opacity === undefined ||
      opacity < 0 ||
      opacity > 255
    ) {
      opacity = this.a;
    }
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${opacity})`;
  }

  toRGBAWithVNoOpacity(newV: number) {
    if (newV > 100 || newV < 0) {
      return this.toRGBA(255);
    }
    const { h, s } = this.toHSV();
    const tempColor = Color.fromHSV({
      h,
      s,
      v: newV,
      a: 255,
    });
    return tempColor.toRGBA();
  }

  toHex() {
    const alphaHex = this.a.toString(16).padStart(2, '0');
    const redHex = this.r.toString(16).padStart(2, '0');
    const greenHex = this.g.toString(16).padStart(2, '0');
    const blueHex = this.b.toString(16).padStart(2, '0');
    return `#${alphaHex}${redHex}${greenHex}${blueHex}`.toUpperCase();
  }

  toOpacityPercent() {
    return Math.floor((this.a / 255) * 100);
  }
}
