export default function createCanvas(width: number, height: number) {
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
    destroy() {
      canvas.width = 0;
      canvas.height = 0;
    },
  };
}
