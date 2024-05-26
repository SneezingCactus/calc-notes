import App from './App.svelte';
import { initEditor } from './editor';
import './style.scss';

const app = new App({
  target: document.body,
});

initEditor(document.getElementById('editor-container') as HTMLElement);
