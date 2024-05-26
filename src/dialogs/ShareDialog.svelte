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
    <TextField readonly bind:value={link}></TextField>
    <div class="button-row">
      <DialogButton on:click={close}>Cancel</DialogButton>
      <DialogButton on:click={copyLink}>{copied ? 'Copied!' : 'Copy link'}</DialogButton>
    </div>
  </DialogPanel>
{/if}
