<script lang="ts">
  import ActionBar from "./ActionBar.svelte";

</script>

<div id="app-container">
  <ActionBar></ActionBar>
  <div id="code-container"></div>
</div>

<style>
  #app-container {
    display: flex;
    width: 100%;
    height: 100%;
  }

  #code-container {
    width: 100%;
    flex-grow: 1;
  }
</style>