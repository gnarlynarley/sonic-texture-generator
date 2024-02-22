import perlinNoise from './renderPerlinNoise';

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context)
    throw new Error('Could not retrieve the context from the canvas.');

  canvas.width = width;
  canvas.height = height;
  return {
    canvas,
    context,
    width,
    height,
    destroy() {},
  };
}

function drawCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2);
  context.fill();
}

function createDotCanvas(grid: number, size: number) {
  const { canvas, context, width, height } = createCanvas(grid, grid);

  drawCircle(context, 0, 0, size); // 1
  drawCircle(context, 0, width, size); // 2
  drawCircle(context, height, 0, size); // 3
  drawCircle(context, width, height, size); // 4
  drawCircle(context, width * 0.5, height * 0.5, size);

  return canvas;
}

function createLineCanvas(grid: number, size: number) {
  const { canvas, context, width, height } = createCanvas(grid, grid);

  context.strokeStyle = 'black';
  context.lineWidth = size;
  context.beginPath();
  context.moveTo(0, height);
  context.lineTo(width, 0);
  context.stroke();
  context.lineWidth = size;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(width, height);
  context.stroke();

  return canvas;
}

export default class TextureGenerator {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext('2d')!;
    // this.generate();
    perlinNoise(this.canvas);
  }

  generate() {
    this.clearCanvas();
    this.createHalftone(50);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  createHalftone(gridSize: number) {
    const { context, width, height } = this;

    const dotCanvas = createDotCanvas(gridSize, gridSize * 0.2);
    const dotPattern = context.createPattern(dotCanvas, 'repeat')!;

    context.fillStyle = dotPattern;
    context.fillRect(0, 0, width, height);

    const lineCanvas = createLineCanvas(gridSize, gridSize * 0.1);
    const linePattern = context.createPattern(lineCanvas, 'repeat')!;

    context.fillStyle = linePattern;
    context.fillRect(0, 0, width, height);
  }
}
