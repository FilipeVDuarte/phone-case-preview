export interface PhoneModel {
  id: string;
  name: string;
  mockupImageUrl: string; // phone frame image
  screenMaskPath: string; // SVG path string for clip mask
  screenOffsetX: number; // position of screen within frame
  screenOffsetY: number;
  screenWidth: number;
  screenHeight: number;
  frameWidth: number;
  frameHeight: number;
}

// Phone screen mask path from Figma design (red-outlined SVG in the wireframe)
const IPHONE_SCREEN_MASK_PATH = `M48.0742 0.5H232.722C258.996 0.500159 280.295 21.8 280.295 48.0742V562.684C280.295 588.958 258.996 610.257 232.722 610.257H48.0742C21.8 610.257 0.500234 588.958 0.5 562.684V48.0742C0.5 21.7999 21.7999 0.5 48.0742 0.5Z`;

export const PHONE_MODELS: PhoneModel[] = [
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    mockupImageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/1d7274ae1bf448eff9f7cdb11c51a0cef8cb6185?width=610",
    screenMaskPath: IPHONE_SCREEN_MASK_PATH,
    screenOffsetX: 11,
    screenOffsetY: 12,
    screenWidth: 281,
    screenHeight: 611,
    frameWidth: 305,
    frameHeight: 629,
  },
  {
    id: "iphone-17",
    name: "iPhone 17",
    mockupImageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/1d7274ae1bf448eff9f7cdb11c51a0cef8cb6185?width=610",
    screenMaskPath: IPHONE_SCREEN_MASK_PATH,
    screenOffsetX: 11,
    screenOffsetY: 12,
    screenWidth: 281,
    screenHeight: 611,
    frameWidth: 305,
    frameHeight: 629,
  },
  {
    id: "iphone-17-air",
    name: "iPhone 17 Air",
    mockupImageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/1d7274ae1bf448eff9f7cdb11c51a0cef8cb6185?width=610",
    screenMaskPath: IPHONE_SCREEN_MASK_PATH,
    screenOffsetX: 11,
    screenOffsetY: 12,
    screenWidth: 281,
    screenHeight: 611,
    frameWidth: 305,
    frameHeight: 629,
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    mockupImageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/1d7274ae1bf448eff9f7cdb11c51a0cef8cb6185?width=610",
    screenMaskPath: IPHONE_SCREEN_MASK_PATH,
    screenOffsetX: 11,
    screenOffsetY: 12,
    screenWidth: 281,
    screenHeight: 611,
    frameWidth: 305,
    frameHeight: 629,
  },
];

export function getPhoneModelById(id: string): PhoneModel | undefined {
  return PHONE_MODELS.find((model) => model.id === id);
}
