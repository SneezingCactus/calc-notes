<script lang="ts">
  export let label: string | undefined = undefined;
  export let value = '';
  export let readonly = false;
</script>

<div>
  {#if label}
    <span>{label}</span>
  {/if}
  <input type="text" {readonly} bind:value />
</div>

<style lang="scss">
  span {
    color: var(--subtext);
    font-size: 0.8em;
    line-height: 2;
  }

  input {
    box-sizing: border-box;
    border: none;
    border-radius: 4px;
    background-color: var(--secondary-panel-bg);
    padding: 10px;
    width: 100%;
    font-family: inherit;
  }
</style>
