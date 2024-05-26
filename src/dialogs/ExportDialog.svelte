<script lang="ts">
  import DialogPanel from './DialogPanel.svelte';
  import DialogButton from './DialogButton.svelte';
  import { loadDialogOpened as exportDialogOpened } from '../stores';
  import TextField from './TextField.svelte';
  import { exportFile } from '../editor';

  let opened = false;
  let fileName = '';

  exportDialogOpened.subscribe((value) => {
    opened = value;
    fileName = 'CalcNotes File';
  });

  function close() {
    exportDialogOpened.set(false);
  }
</script>

{#if opened}
  <DialogPanel on:close={close}>
    <h1>Export to file</h1>
    <TextField label="File name" bind:value={fileName}></TextField>
    <div class="button-row">
      <DialogButton on:click={close}>Cancel</DialogButton>
      <DialogButton on:click={() => exportFile(fileName)}>Export</DialogButton>
    </div>
  </DialogPanel>
{/if}

<style lang="scss">
  .doc-list {
    height: 400px;
    max-height: calc(100vh - 250px);
    overflow-y: auto;
  }
</style>
