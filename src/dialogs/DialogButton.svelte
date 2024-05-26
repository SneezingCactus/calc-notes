<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function onClick() {
    dispatch('click');
  }
</script>

<button on:click={onClick}><slot></slot></button>

<style lang="scss">
  button {
    cursor: pointer;
    margin-left: 10px;
    border: none;
    border-radius: 4px;
    background: var(--button-bg);
    padding: 10px 20px;
    color: var(--text);
    line-height: 1;
    font-family: inherit;

    &:hover {
      background: var(--button-hover-bg);
    }
  }
</style>
