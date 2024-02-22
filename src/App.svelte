<script lang="ts">
  import { onMount } from "svelte";
  import generateTexture from "./lib/generateTexture";
  import { saveAs } from "file-saver";
  import type { FormEventHandler } from "svelte/elements";

  let gridSize = 20;
  let dotScale = 5;
  let lineWidth = 4;
  let width = 500;
  let height = 500;
  let posterizationRange = 2;
  let textureImageSource: string | null = null;
  generate();

  function generate() {
    const seed = Math.random().toString();
    const next = generateTexture({
      gridSize,
      dotScale: dotScale / 10,
      lineWidth: lineWidth / 10,
      width,
      height,
      seed,
      posterizationRange,
    });
    textureImageSource = next;

    return next;
  }

  function handleSubmid(ev: Event) {
    ev.preventDefault();
    generate();
  }

  function saveCanvasAsImage() {
    if (textureImageSource) {
      saveAs(textureImageSource, "texture.png");
    }
  }

  onMount(() => generate());
</script>

<form on:submit={handleSubmid}>
  <label
    ><p>width</p>
    <input bind:value={width} type="number" /></label
  >
  <label
    ><p>height</p>
    <input bind:value={height} type="number" /></label
  >
  <label>
    <p>grid size</p>
    <input bind:value={gridSize} step={1} type="range" min={5} max={80} />
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
    ><p>posterization</p>
    <input
      bind:value={posterizationRange}
      step={1}
      type="range"
      min={1}
      max={5}
    /></label
  >
  <button type="submit">generate</button>
  <button type="button" on:click={saveCanvasAsImage}>save texture</button>

  <p class="credits">
    Made by <a
      href="https://twitter.com/GnarlyNarley"
      target="_blank"
      rel="noopener noreferrer">Narley</a
    >
    with help from
    <a href="https://twitter.com/EroCopi" rel="noopener noreferrer"
      >thehumancopier</a
    >, get
    <a
      href="https://thehumancopier.gumroad.com/l/crvee"
      rel="noopener noreferrer"
    >
      here
    </a> his action for Clip Studio Paint.
  </p>
</form>

{#if textureImageSource}
  <img src={textureImageSource} alt="The cool sonic texture" />
{/if}

<style>
  img {
    width: auto;
  }

  form {
    position: fixed;
    width: auto;
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

  .credits {
    max-width: 15em;
    font-size: 0.7em;
  }
</style>
