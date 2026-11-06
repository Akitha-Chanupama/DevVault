export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface ContrastResult {
  ratio: number;
  scoreText: string;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

export interface ColorDetails {
  hex: string;
  rgb: RgbColor;
  rgbString: string;
  hsl: HslColor;
  hslString: string;
  luminance: number;
}
