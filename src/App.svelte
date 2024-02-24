<script lang="ts">
  import { onMount } from "svelte";
  import generateTexture from "./lib/generateTexture";
  import { saveAs } from "file-saver";
  import createImage from "./lib/utils/createImage";
  import renderLayers, {
    blendingModes,
    type BlendingModeType,
  } from "./lib/utils/renderLayers";
  import debounce from "./lib/utils/debounce";
  import Button from "./lib/components/Button.svelte";

  let files: FileList | null = null;
  $: file = files?.[0] ?? null;
  let gridSize = 10 ?? 30;
  let dotScale = 0.7;
  let lineScale = 0.5;
  let width = 500;
  let height = 500;
  let posterizationRange = 2;
  let textureCanvas: HTMLCanvasElement;
  let imageOpacity = 20;
  let imageBlendingMode: BlendingModeType = "overlay";

  let image: HTMLImageElement | null = null;
  let imageSrc: string | null = null;
  $: {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    if (file) {
      imageSrc = URL.createObjectURL(file);
    } else {
      imageSrc = null;
      image = null;
    }
    if (imageSrc) {
      createImage(imageSrc).then((value) => {
        image = value;
        width = value.width;
        height = value.height;
        generate();
      });
    }
  }

  $: canvasImageSrc = renderLayers(
    width,
    height,
    image
      ? [
          {
            image: textureCanvas,
            opacity: imageOpacity / 100,
            blendingMode: imageBlendingMode,
          },
          { image, opacity: 1, blendingMode: "normal" },
        ]
      : [{ image: textureCanvas, opacity: 1, blendingMode: "normal" }],
  );

  async function generate() {
    const seed = Math.random().toString();
    textureCanvas = generateTexture({
      gridSize,
      dotScale,
      lineScale,
      width,
      height,
      seed,
      posterizationRange,
    });
  }

  function handleSubmit(ev: Event) {
    ev.preventDefault();
    generate();
  }

  function saveCanvasAsImage() {
    if (canvasImageSrc) {
      saveAs(canvasImageSrc, "texture.png");
    }
  }

  function clearImage() {
    files = null;
  }

  const handleImageOpacityInput = debounce((e: any) => {
    imageOpacity = e.target.value;
  });

  onMount(() => generate());
</script>

<details class="controls" open>
  <summary>Options</summary>
  <form on:submit={handleSubmit}>
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

    <Button type="submit" primary>generate</Button>

    <Button type="button" on:click={saveCanvasAsImage}>save texture</Button>

    <hr />

    <input bind:files type="file" accept="image/*" />

    {#if image}
      <label>
        <p>Blending mode</p>
        <select bind:value={imageBlendingMode}>
          {#each blendingModes as blendingMode}
            <option value={blendingMode}>{blendingMode}</option>
          {/each}
        </select>
      </label>
      <label>
        <p>Opacity</p>
        <input
          on:input={handleImageOpacityInput}
          value={imageOpacity}
          step={1}
          type="number"
          min={0}
          max={100}
        />
      </label>
      <Button type="button" on:click={clearImage} caution>clear image</Button>
    {/if}

    <hr />

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
</details>

{#if canvasImageSrc}
  <img src={canvasImageSrc} alt="The cool sonic texture" />
{/if}

<style>
  img {
    width: auto;
  }

  input {
    width: 100%;
  }

  .controls {
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

  .controls form {
    display: flex;
    flex-direction: column;
    gap: var(--gutter);
  }

  .credits {
    max-width: 15em;
    font-size: 0.7em;
  }
</style>
