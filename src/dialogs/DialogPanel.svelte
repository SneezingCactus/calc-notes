<script lang="ts">
  import { scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function onClose() {
    dispatch('close');
  }
</script>

<div class="dialog-container">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="dialog-cover" role="button" tabindex="0" on:click={onClose}></div>
  <div class="dialog-panel" transition:scale={{ duration: 200, start: 0.75, opacity: 0 }}>
    <slot></slot>
  </div>
</div>

<style lang="scss">
  .dialog-container {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .dialog-panel {
    z-index: 1;
    box-sizing: border-box;
    box-shadow: 4px 4px 15px #00000033;
    border-radius: 10px;
    background-color: var(--panel-bg);
    padding: 20px;
    width: calc(100% - 50px);
    max-width: 400px;

    :global(h1) {
      margin-bottom: 40px;
      font-size: 1.75em;
      line-height: 0;
    }

    :global(.button-row) {
      display: flex;
      justify-content: flex-end;
      margin-top: 40px;
    }
  }

  .dialog-cover {
    position: absolute;
    backdrop-filter: blur(15px);
    width: 100%;
    height: 100%;
  }
</style>
