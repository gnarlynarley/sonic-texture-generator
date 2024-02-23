<script lang="ts">
  import { onMount } from "svelte";
  import generateTexture from "./lib/generateTexture";
  import { saveAs } from "file-saver";
  import type { FormEventHandler } from "svelte/elements";

  let gridSize = 30;
  let dotScale = 0.5;
  let lineScale = 0.5;
  let width = 500;
  let height = 500;
  let posterizationRange = 2;
  let textureImageSource: string | null = null;
  generate();

  function generate() {
    const seed = Math.random().toString();
    const next = generateTexture({
      gridSize,
      dotScale,
      lineScale,
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
      min={0}
      max={1}
    /></label
  >
  <label
    ><p>line</p>
    <input
      bind:value={lineScale}
      step={0.1}
      type="range"
      min={0}
      max={1}
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
    border-radius: 0.3em;
    border: 2px solid color-mix(in srgb, white, transparent 90%);
    backdrop-filter: blur(2px);
    box-shadow: 0 0.1em 0.3em color-mix(in srgb, black, transparent 50%);
  }

  .credits {
    max-width: 15em;
    font-size: 0.7em;
  }
</style>
