/* Following canvas-based Perlin generation code originates from
 * iron_wallaby's code at: http://www.ozoneasylum.com/30982
 */
function randomNoise(
  canvas: HTMLCanvasElement,
  x: number = 0,
  y: number = 0,
  width: number = canvas.width,
  height: number = canvas.height,
  alpha: number = 255
) {
  var context = canvas.getContext('2d')!;
  const imageData = context.getImageData(x, y, width, height);
  const pixels = imageData.data;
  const n = pixels.length;
  let i = 0;
  while (i < n) {
    pixels[i++] = pixels[i++] = pixels[i++] = (Math.random() * 256) | 0;
    pixels[i++] = alpha;
  }
  context.putImageData(imageData, x, y);
  return canvas;
}

export default function perlinNoise(canvas: HTMLCanvasElement) {
  const noise = randomNoise(canvas);
  var context = canvas.getContext('2d')!;
  context.save();

  /* Scale random iterations onto the canvas to generate Perlin noise. */
  for (var size = 4; size <= noise.width; size *= 2) {
    var x = (Math.random() * (noise.width - size)) | 0,
      y = (Math.random() * (noise.height - size)) | 0;
    context.globalAlpha = 4 / size;
    context.drawImage(
      noise,
      x,
      y,
      size,
      size,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  context.restore();
  return canvas;
}
