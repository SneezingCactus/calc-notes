import { dispatchRedo, dispatchUndo, exportFile, importFile, newFile, openSearchBox } from '../editor.js';
import { loadDialogOpened, shareDialogOpened } from '../stores.js';

export interface MenuGroupDef {
  name: string;
  items: MenuItemDef[];
}

export interface MenuGenericItemDef {
  type: string;
}

export interface MenuActionDef {
  type: 'action';
  name: string;
  callback: () => void;
}

export interface MenuSeparatorDef {
  type: 'separator';
}

export type MenuItemDef = MenuActionDef | MenuSeparatorDef;

const items: MenuGroupDef[] = [
  {
    name: 'File',
    items: [
      {
        type: 'action',
        name: 'Import from File...',
        callback: importFile,
      },
      {
        type: 'action',
        name: 'Export to File...',
        callback: () => {
          loadDialogOpened.set(true);
        },
      },
      {
        type: 'separator',
      },
      {
        type: 'action',
        name: 'Share Link',
        callback: () => {
          shareDialogOpened.set(true);
        },
      },
    ],
  },
  {
    name: 'Edit',
    items: [
      {
        type: 'action',
        name: 'Undo',
        callback: dispatchUndo,
      },
      {
        type: 'action',
        name: 'Redo',
        callback: dispatchRedo,
      },
      {
        type: 'separator',
      },
      {
        type: 'action',
        name: 'Find / Replace',
        callback: openSearchBox,
      },
      {
        type: 'separator',
      },
      {
        type: 'action',
        name: 'Preferences',
        callback: () => {
          alert('Not implemented yet. Sorry.');
        },
      },
    ],
  },
];

export default items;
