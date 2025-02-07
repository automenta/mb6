import { expect, test } from 'vitest';
import { App } from '../src/ui/App.js';
import 'fake-indexeddb/auto';
import { vi } from 'vitest';
import LayoutManager from '../src/ui/LayoutManager.js';


test('UI component should render content to the #app element', () => {
  document.body.innerHTML = '<div id="app"></div>';
  const app = new App(null, new LayoutManager());
  app.render();
  const appElement = document.getElementById('app');
  expect(appElement.children.length).toBeGreaterThan(0);
});