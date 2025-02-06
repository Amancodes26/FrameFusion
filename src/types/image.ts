export type ImageModel = 'flux' | 'flux-realism' | 'any-dark' | 'flux-anime' | 'flux-3d' | 'turbo';

export interface ImageGenerationParams {
  prompt: string;
  model?: ImageModel;
  seed?: number;
  width?: number;
  height?: number;
  noLogo?: boolean;
}

export const MODEL_DESCRIPTIONS = {
  'flux': 'General purpose model, good for most use cases',
  'flux-realism': 'Photorealistic images and detailed scenes',
  'any-dark': 'Dark and moody artistic style',
  'flux-anime': 'Anime and manga style illustrations',
  'flux-3d': '3D rendered images and graphics',
  'turbo': 'Fast generation with good quality'
} as const;
