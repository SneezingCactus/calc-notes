// imports for pre-made extensions
import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
  scrollPastEnd,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, undo, redo } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches, openSearchPanel } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';

// imports for custom extensions
import { WidgetType, EditorView, Decoration } from '@codemirror/view';
import { StateField, Range, RangeSet, Transaction } from '@codemirror/state';

import * as math from 'mathjs';

import lzstring from 'lz-string';
import { saveAs } from 'file-saver';

const scope = new Map();

class ExpressionResultWidget extends WidgetType {
  constructor(readonly result: string) {
    super();
  }

  eq(other: ExpressionResultWidget) {
    return other.result == this.result;
  }

  toDOM() {
    const element = document.createElement('div');

    element.setAttribute('aria-hidden', 'true');
    element.classList.add('expression-result');
    element.innerText = '\n  ' + this.result;

    return element;
  }

  ignoreEvent() {
    return false;
  }
}

function decorate(transaction: Transaction): RangeSet<Decoration> {
  const widgets: Range<Decoration>[] = [];

  scope.clear();

  for (let i = 0; i < transaction.newDoc.lines; i++) {
    const line = transaction.newDoc.line(i + 1);
    let result;

    try {
      result = math.evaluate(line.text, scope);

      if (result === undefined || typeof result === 'function') continue;

      if (result.type == 'Fraction') {
        result = result.toFraction();
      } else {
        result = math.string(result);
      }
    } catch (e) {
      result = (e as Error).message;
    }

    widgets.push(
      Decoration.widget({
        widget: new ExpressionResultWidget(result),
        side: 1,
      }).range(line.to),
    );
  }

  return widgets.length > 0 ? RangeSet.of(widgets) : Decoration.none;
}

export let editorView: EditorView;

export async function initEditor(editorParent: HTMLElement) {
  editorView = new EditorView({
    doc: '',
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      scrollPastEnd(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
      ]),
      StateField.define({
        create(_state) {
          return Decoration.set([]);
        },
        update(value, transaction) {
          if (transaction.docChanged) return decorate(transaction);
          return value.map(transaction.changes);
        },
        provide: (f) => EditorView.decorations.from(f),
      }),
      // EditorView.theme({}, { dark: true }),
    ],
    parent: editorParent,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const pasteId = urlParams.get('p'); // shared paste id

  if (pasteId) {
    const res = await fetch(`https://calc-notes-workers.sneezingcactus452.workers.dev/api/share?p=${pasteId}`);

    if (res.ok) {
      const text = await res.text();

      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.toString().length, insert: text },
      });
    }
  }
}

export function dispatchUndo() {
  undo(editorView);
}

export function dispatchRedo() {
  redo(editorView);
}

export function openSearchBox() {
  openSearchPanel(editorView);
}

export function newFile() {
  editorView.dispatch({
    changes: { from: 0, to: editorView.state.doc.toString().length, insert: '' },
  });
}

export function importFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.click();

  input.addEventListener('change', function (e) {
    const file = input.files![0];

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.addEventListener('load', function (readerEvent) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.toString().length,
          insert: readerEvent.target?.result?.toString(),
        },
      });
    });
  });
}

export function exportFile(fileName: string) {
  saveAs(new Blob([editorView.state.doc.toString()], { type: 'text/plain;charset=utf-8' }), `${fileName}.txt`);
}

export async function getShareLink() {
  const res = await fetch('https://calc-notes-workers.sneezingcactus452.workers.dev/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: editorView.state.doc.toString(),
  });

  if (res.ok) {
    const pasteId = await res.text();

    return `${location.origin}${location.pathname}?p=${pasteId}`;
  } else {
    return 'Failed to get share link';
  }
}
