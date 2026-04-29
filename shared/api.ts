/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface PhoneModel {
  id: string;
  name: string;
  mockupImageUrl: string;
  screenMaskPath: string;
  screenOffsetX: number;
  screenOffsetY: number;
  screenWidth: number;
  screenHeight: number;
  frameWidth: number;
  frameHeight: number;
  isAvailable: boolean;
}

export interface DemoResponse {
  message: string;
}
