<script lang="ts">
  import generateTexture from "./lib/generateTexture";
  import debounce from "./lib/utils/debounce";
  import saveFile from "./lib/utils/saveFile";

  const debouncedGenerateTexture = debounce(generateTexture, 200);

  let canvas: HTMLCanvasElement | undefined;
  let gridSize = 50;
  let dotScale = 5;
  let lineWidth = 4;
  let width = 1920;
  let height = 1080;
  let seed = Math.random().toString();

  $: console.log(gridSize);

  function regenerate() {
    seed = Math.random().toString();
  }

  function saveCanvasAsImage() {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "texture.png");
      saveFile(file);
    }, "image/png");
  }

  $: {
    if (canvas) {
      debouncedGenerateTexture({
        canvas,
        gridSize,
        dotScale: dotScale / 10,
        lineWidth: lineWidth / 10,
        width,
        height,
        seed,
      });
    }
  }
</script>

<div>
  <label>
    <p>grid size</p>
    <input bind:value={gridSize} step={1} type="range" min={5} max={200} />
  </label>
  <label
    ><p>dot</p>
    <input
      bind:value={dotScale}
      step={0.1}
      type="range"
      min={1}
      max={10}
    /></label
  >
  <label
    ><p>line</p>
    <input
      bind:value={lineWidth}
      step={0.1}
      type="range"
      min={0}
      max={5}
    /></label
  >
  <label
    ><p>width</p>
    <input bind:value={width} type="number" /></label
  >
  <label
    ><p>height</p>
    <input bind:value={height} type="number" /></label
  >
  <button type="button" on:click={regenerate}>regenerate</button>
  <button type="button" on:click={saveCanvasAsImage}>save texture</button>
</div>

<canvas bind:this={canvas} />

<style>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  div {
    position: fixed;
    top: 1em;
    left: 1em;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 0.5em;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(2px);
  }
</style>
