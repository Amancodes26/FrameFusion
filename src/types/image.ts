export type ImageModel = "flux" | "kontext" | "gptimage" | "zimage" | "klein";

export interface ImageGenerationParams {
  prompt: string;
  model?: ImageModel;
  seed?: number;
  width?: number;
  height?: number;
  noLogo?: boolean;
}

export const SUPPORTED_IMAGE_MODELS: ImageModel[] = [
  "flux",
  "kontext",
  "gptimage",
  "zimage",
  "klein",
];

export const LEGACY_MODEL_ALIASES: Record<string, ImageModel> = {
  "flux-realism": "gptimage",
  "any-dark": "flux",
  "flux-anime": "flux",
  "flux-3d": "flux",
  "turbo": "zimage",
  "gpt-image": "gptimage",
  "gpt-image-1-mini": "gptimage",
  "z-image": "zimage",
  "z-image-turbo": "zimage",
  "flux-klein": "klein",
};

export const MODEL_DESCRIPTIONS: Record<ImageModel, string> = {
  flux: "Fast all-round model for most prompts",
  kontext: "Excellent prompt adherence and in-context composition",
  gptimage: "High-quality, realistic image generation",
  zimage: "Turbo-style fast generation with good detail",
  klein: "Balanced quality and speed for creative outputs",
};
