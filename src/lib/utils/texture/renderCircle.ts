export default function renderCircle(
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
