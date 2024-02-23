import createCanvas from "../createCanvas";
import posterization from "./posterization";

export default function noise(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  scale: number,
  rand: () => number,
) {
  const offscreen = createCanvas(
    Math.ceil(canvas.width * scale),
    Math.ceil(canvas.height * scale),
  );
  const scaled = createCanvas(canvas.width, canvas.height);
  const imageData = new ImageData(canvas.width, canvas.height);
  const pixels = imageData.data;
  const length = pixels.length;

  for (let i = 0; i < length; i += 4) {
    const value = rand() * 255;
    pixels[i + 0] = value;
    pixels[i + 1] = value;
    pixels[i + 2] = value;
    pixels[i + 3] = 255;
  }

  offscreen.context.putImageData(imageData, 0, 0);

  scaled.context.drawImage(offscreen.canvas, 0, 0, canvas.width, canvas.height);
  posterization(scaled.canvas, scaled.context, 1);
  context.drawImage(scaled.canvas, 0, 0, canvas.width, canvas.height);
  offscreen.destroy();
}
