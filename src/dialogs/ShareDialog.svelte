<script lang="ts">
  import DialogPanel from './DialogPanel.svelte';
  import DialogButton from './DialogButton.svelte';
  import { shareDialogOpened } from '../stores';
  import TextField from './TextField.svelte';
  import { getShareLink } from '../editor';

  let opened = false;
  let link = '';
  let copied = false;

  shareDialogOpened.subscribe(async (value) => {
    opened = value;

    if (value) {
      link = 'Uploading...';
      link = await getShareLink();
    }
  });

  function close() {
    shareDialogOpened.set(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(link);

    copied = true;
    setTimeout(() => {
      copied = false;
    }, 4000);
  }
</script>

{#if opened}
  <DialogPanel on:close={close}>
    <h1>Share link</h1>
    <div class="temporary-note">
      Be aware that CalcNotes uses <a href="https://nopaste.net">nopaste.net</a> to store shared content, and as such, these
      links are temporary and will expire in 2 years.
    </div>
    <TextField readonly bind:value={link}></TextField>
    <div class="button-row">
      <DialogButton on:click={close}>Cancel</DialogButton>
      <DialogButton on:click={copyLink}>{copied ? 'Copied!' : 'Copy link'}</DialogButton>
    </div>
  </DialogPanel>
{/if}

<style lang="scss">
  @use 'sass:color';

  .temporary-note {
    box-sizing: border-box;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: var(--warning-panel-bg);
    padding: 10px;
    width: 100%;
    color: var(--warning-panel-text);
    font-size: 0.8em;

    a {
      color: var(--warning-panel-text);
    }
  }
</style>
