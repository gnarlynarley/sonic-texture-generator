<script lang="ts">
  export let primary = false;
  export let caution = false;
</script>

<button {...$$props} on:click class:primary class:caution><slot /></button>

<style>
  button {
    --color: transparent;
    --text: currentColor;
    display: block;
    width: 100%;
    padding: 0.5em;
    border: 1px solid currentColor;
    background: var(--color);
    color: var(--text);
    border-radius: 0.2em;
  }

  .primary {
    --color: var(--color-primary);
    --text: var(--color-primary-300);
  }
  .caution {
    --color: var(--color-error);
    --text: var(--color-error-900);
  }
</style>
