import './style.css';

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
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';

import { WidgetType, EditorView, Decoration } from '@codemirror/view';
import { StateField, Range, RangeSet, Transaction } from '@codemirror/state';

import * as math from 'mathjs';

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

new EditorView({
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
  parent: document.body,
});
