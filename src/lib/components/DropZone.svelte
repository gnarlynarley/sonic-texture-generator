<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{ files: File[] }>();

  function dragover(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  function dragleave(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  function handleFiles(files: File[]) {
    dispatch("files", files);
  }

  function drop(ev: DragEvent) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    ev.stopPropagation();

    if (ev.dataTransfer?.items) {
      // Use DataTransferItemList interface to access the file(s)
      const files = [...ev.dataTransfer.items].flatMap((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          return file ?? [];
        }
        return [];
      });
      handleFiles(files);
    } else {
      // Use DataTransfer interface to access the file(s)
      const files = [...(ev.dataTransfer?.files ?? [])].map((file) => {
        return file;
      });
      handleFiles(files);
    }
  }
</script>

<svelte:body
  on:dragover={dragover}
  on:dragleave={dragleave}
  on:drop={drop}
  class:active
/>
<slot />
