import createCanvas from "./createCanvas";

export type Layer = {
  opacity: number;
  blendingMode: BlendingModeType;
  image: HTMLCanvasElement | HTMLImageElement | null;
};

export type BlendingModeType =
  | "normal"
  | "multiply"
  | "overlay"
  | "soft-light"
  | "hard-light";
const BLENDING_MODE_MAP: Record<BlendingModeType, GlobalCompositeOperation> = {
  normal: "source-over",
  multiply: "multiply",
  overlay: "overlay",
  "soft-light": "soft-light",
  "hard-light": "hard-light",
};

export const blendingModes = Object.keys(BLENDING_MODE_MAP);

export default function renderLayers(
  width: number,
  height: number,
  layers: Layer[],
) {
  console.log("render layers");
  const { canvas, context, destroy } = createCanvas(width, height);

  for (const layer of layers.toReversed()) {
    if (layer.image == null) return;
    context.globalAlpha = layer.opacity;
    context.globalCompositeOperation = BLENDING_MODE_MAP[layer.blendingMode];
    context.drawImage(layer.image, 0, 0);
  }

  const url = canvas.toDataURL("image/png");
  destroy();
  return url;
}
