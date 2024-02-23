import assert from "./utils/assert";
import seedRand from "./utils/rand";
import noise from "./utils/texture/noise";
import createCanvas from "./utils/createCanvas";
import posterization from "./utils/texture/posterization";

export default function generateTexture({
  gridSize,
  dotScale,
  lineScale,
  width,
  height,
  posterizationRange,
  seed,
}: {
  gridSize: number;
  dotScale: number;
  lineScale: number;
  width: number;
  height: number;
  posterizationRange: number;
  seed: string;
}) {
  const rand = seedRand(seed);

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
    dotSize: number,
  ) {
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
    halftone.destroy();
  }

  function renderLines(
    { width, height }: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    lineSize: number,
  ) {
    const line1 = createCanvas(gridSize, gridSize);
    renderLine(line1.context, 0, 0, gridSize, gridSize, lineSize);
    line1.context.save();
    line1.context.translate(gridSize * 0.5, gridSize * -0.5);
    renderLine(line1.context, 0, 0, gridSize, gridSize, lineSize);
    line1.context.restore();
    line1.context.translate(gridSize * -0.5, gridSize * 0.5);
    renderLine(line1.context, 0, 0, gridSize, gridSize, lineSize);
    const line2 = createCanvas(gridSize, gridSize);
    line2.context.translate(gridSize, 0);
    line2.context.scale(-1, 1);
    line2.context.drawImage(line1.canvas, 0, 0);
    const line3 = createCanvas(gridSize, gridSize);
    line3.context.drawImage(line1.canvas, 0, 0);
    line3.context.drawImage(line2.canvas, 0, 0);
    const lines = [line1, line2, line3];
    const length = lines.length;

    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const chosenLine = lines[Math.floor(rand() * length)];
        context.drawImage(chosenLine.canvas, x, y);
      }
    }

    lines.forEach((l) => l.destroy());
  }

  const texture = createCanvas(width, height);
  texture.context.fillStyle = "white";
  texture.context.fillRect(0, 0, width, height);
  const dotSize = gridSize * dotScale * 0.33;
  const lineSize = dotSize * lineScale * 2;

  renderLines(texture.canvas, texture.context, lineSize);
  renderHalftone(texture.canvas, texture.context, dotSize);
  posterization(texture.canvas, texture.context, posterizationRange);

  const url = texture.canvas.toDataURL();

  texture.destroy();
  return url;
}
