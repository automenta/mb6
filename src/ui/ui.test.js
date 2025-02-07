import { expect, test } from 'vitest';
import { App } from './App.js';
import 'fake-indexeddb/auto';
import { vi } from 'vitest';

vi.mock('@yjs/dom', () => ({
    DOMBinding: vi.fn(() => ({
        destroy: vi.fn(),
    })),
}));

test('UI component should render content to the #app element', () => {
  document.body.innerHTML = '<div id="app"></div>';
  const app = new App();
  app.render();
  const appElement = document.getElementById('app');
  expect(appElement.children.length).toBeGreaterThan(0);
});