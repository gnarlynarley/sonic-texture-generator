import assert from "./utils/assert";
import seedRand from "./utils/rand";

export default function generateTexture({
  canvas,
  gridSize,
  dotScale,
  lineWidth,
  width,
  height,
  seed,
}: {
  canvas: HTMLCanvasElement;
  gridSize: number;
  dotScale: number;
  lineWidth: number;
  width: number;
  height: number;
  seed: string;
}) {
  const rand = seedRand(seed);
  function createCanvas(width: number, height: number) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    if (!context) throw new Error("Could not create context.");

    return {
      canvas,
      context,
      width,
      height,
    };
  }

  function renderCircle(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
  ) {
    context.fillStyle = "black";
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }

  function renderLine(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeWidth: number,
  ) {
    context.lineWidth = strokeWidth;
    context.strokeStyle = "black";
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function renderHalftone(
    { width, height }: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    gridSize: number,
    scale: number,
  ) {
    const dotSize = (gridSize * scale) / 2;
    const halftone = createCanvas(gridSize, gridSize);
    renderCircle(halftone.context, 0, 0, dotSize);
    renderCircle(halftone.context, gridSize, 0, dotSize);
    renderCircle(halftone.context, 0, gridSize, dotSize);
    renderCircle(halftone.context, gridSize, gridSize, dotSize);
    renderCircle(halftone.context, gridSize * 0.5, gridSize * 0.5, dotSize);

    const pattern = context.createPattern(halftone.canvas, "repeat");
    assert(pattern);
    context.fillStyle = pattern;
    context.fillRect(0, 0, width, height);
  }

  function renderLines(
    { width, height }: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    gridSize: number,
    stroke: number,
  ) {
    const line1 = createCanvas(gridSize, gridSize);
    renderLine(line1.context, 0, 0, gridSize, gridSize, stroke);
    renderLine(line1.context, 0, gridSize, gridSize, 0, stroke);
    const line2 = createCanvas(gridSize, gridSize);
    renderLine(line2.context, 0, 0, gridSize, gridSize, stroke);
    const line3 = createCanvas(gridSize, gridSize);
    renderLine(line3.context, 0, gridSize, gridSize, 0, stroke);
    const lines = [line1, line2, line3];

    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const chosenLine = lines[Math.floor(rand() * 3)];
        context.drawImage(chosenLine.canvas, x, y);
      }
    }
  }

  function posterization(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    value: number,
  ) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i + 0];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      const average = (r + g + b) / 3;
      const pixelValue = (Math.round((average / 255) * value) * 255) / value;

      pixels[i + 0] = pixelValue;
      pixels[i + 1] = pixelValue;
      pixels[i + 2] = pixelValue;
      pixels[i + 3] = Math.round(a / 255) * 255;
    }

    context.putImageData(imageData, 0, 0);
  }
  const context = canvas.getContext("2d");
  assert(context);

  canvas.width = width;
  canvas.height = height;

  const texture = createCanvas(width, height);
  texture.context.fillStyle = "white";
  texture.context.fillRect(0, 0, width, height);
  renderLines(
    texture.canvas,
    texture.context,
    gridSize,
    (lineWidth * gridSize) / 2,
  );

  renderHalftone(texture.canvas, texture.context, gridSize, dotScale);
  posterization(texture.canvas, texture.context, 5);

  context.drawImage(texture.canvas, 0, 0, canvas.width, canvas.height);
}
