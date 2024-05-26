<script lang="ts">
  import MenuGroup from './MenuGroup.svelte';
  import items from './menuBarItems';
</script>

<div class="bar-container">
  {#each items as actionGroup}
    <MenuGroup {actionGroup}></MenuGroup>
  {/each}
</div>

<style>
  .bar-container {
    display: flex;
    background-color: var(--panel-bg);
  }
</style>
