<script lang="ts">
  import MenuBar from './menu_bar/MenuBar.svelte';
  import ExportDialog from './dialogs/ExportDialog.svelte';
  import ShareDialog from './dialogs/ShareDialog.svelte';
</script>

<div id="app-container">
  <MenuBar></MenuBar>
  <div id="editor-container"></div>
  <ExportDialog></ExportDialog>
  <ShareDialog></ShareDialog>
</div>

<style>
  #app-container {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }

  #editor-container {
    flex-grow: 1;
    flex-basis: 0;
    width: 100%;
    overflow-y: auto;
  }
</style>
