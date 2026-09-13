export type IconStyle = 'outlined' | 'rounded' | 'sharp';

export interface GoogleIconItem {
  name: string;
  categories: string[];
  tags: string[];
  popularity: number;
}

export interface VectorXmlOptions {
  widthDp: number;
  heightDp: number;
  fillColor: string; // e.g. '#FF000000', '@android:color/black', '?attr/colorControlNormal', etc.
  tint?: string;
  alpha?: number; // 0.0 to 1.0
  style: IconStyle;
  isFilled: boolean;
  compatMode: 'group' | 'direct'; // group translateY=960 (standard Android Studio) or direct normalized
}

export interface AndroidSnippets {
  xmlLayout: string;
  jetpackCompose: string;
  resourceFileName: string;
}
