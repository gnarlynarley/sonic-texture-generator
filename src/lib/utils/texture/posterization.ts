export default function posterization(
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
