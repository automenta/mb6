import * as Y from 'yjs';
import NObject from '../src/core/NObject.js';
import { expect, test, vi } from 'vitest';
import { App } from '../src/ui/App.js';
import { EventEmitter } from 'events';
import 'fake-indexeddb/auto';

test('App can be instantiated', () => {
  const emitter = new EventEmitter();
  const pluginManager = { emit: vi.fn() };
  const notifier = { 
    addNotification: vi.fn(), 
    on: vi.fn((event, callback) => {}) // Mock the on method
  };
  const app = new App({ emitter, pluginManager, notifier });
  expect(app).toBeInstanceOf(App);
});
test('App renders main view and content container', async () => {
  // Create the app element in the test environment
  const appElement = document.createElement('div');
  appElement.id = 'app';
  document.body.appendChild(appElement);

  const emitter = new EventEmitter();
  const pluginManager = { emit: vi.fn() };
  const notifier = { 
    addNotification: vi.fn(), 
    on: vi.fn((event, callback) => {}) // Mock the on method
  };
  const app = new App({ emitter, pluginManager, notifier });
  app.render();

  const mainView = document.getElementById('main-view');
  expect(mainView).toBeDefined();

  const contentContainer = document.getElementById('content-container');
  expect(contentContainer).toBeDefined();

  // Clean up the app element after the test
  document.body.removeChild(appElement);
});

test('App creates and renders an NObject', async () => {
  // Create the app element in the test environment
  const appElement = document.createElement('div');
  appElement.id = 'app';
  document.body.appendChild(appElement);

  const emitter = new EventEmitter();
  const pluginManager = { 
    emit: vi.fn(),
    getObjectView: vi.fn().mockReturnValue({
      render: vi.fn((obj) => {
        const div = document.createElement('div');
        div.textContent = obj.name;
        this.el = div;
      }),
      el: document.createElement('div')
    })
  };
  const notifier = { 
    addNotification: vi.fn(), 
    on: vi.fn((event, callback) => {}) // Mock the on method
  };
  const app = new App({ emitter, pluginManager, notifier });
  app.render();

  const tags = new Y.Map();
  const nObject = new NObject('test-id', 'Test NObject', 'Test Content', tags, 'test-author');
  app.createNObject('Test NObject', 'Test Content', {}, tags);

  const contentContainer = document.getElementById('content-container');
  expect(contentContainer.children.length).toBeGreaterThan(0);

  // Clean up the app element after the test
  document.body.removeChild(appElement);
});