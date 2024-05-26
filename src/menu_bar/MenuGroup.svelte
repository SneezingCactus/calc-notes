<script lang="ts">
  import type { MenuGroupDef } from './menuBarItems';

  export let actionGroup: MenuGroupDef;
  let opened = false;

  function onClick() {
    opened = !opened;
  }

  function onBlur() {
    opened = false;
  }
</script>

<div>
  <button class="opener-button" on:click={onClick} on:blur={onBlur}>
    {actionGroup.name}
  </button>
  <div class="item-container {opened ? 'opened' : ''}">
    {#each actionGroup.items as item}
      {#if item.type == 'action'}
        <button on:mousedown={item.callback}>{item.name}</button>
      {:else if item.type == 'separator'}
        <div class="separator"></div>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .opener-button {
    border: none;
    background: none;
    padding: 10px 20px;
    font-family: inherit;

    &:hover {
      cursor: pointer;
      background: var(--button-hover-bg);
    }
  }

  .item-container {
    display: flex;
    position: absolute;
    top: 35px;
    flex-direction: column;
    visibility: hidden;
    z-index: 1;
    box-shadow: 2px 2px 4px #00000033;

    border-radius: 2px;
    background: var(--panel-bg);
    padding: 5px;
    min-width: 200px;

    button {
      border: none;
      border-radius: 2px;
      background: var(--panel-bg);
      padding: 10px 10px;
      color: var(--text);
      line-height: 1;
      font-family: inherit;
      text-align: left;

      &:hover {
        cursor: pointer;
        background: var(--button-hover-bg);
      }
    }

    .separator {
      box-sizing: border-box;
      margin: 5px;
      border-top: 1px solid var(--button-hover-bg);
    }
  }

  .item-container.opened {
    visibility: visible;
  }
</style>
