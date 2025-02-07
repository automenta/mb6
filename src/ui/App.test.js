import { expect, test, vi } from 'vitest';
import { App } from './App.js';
import { EventEmitter } from 'events';
import 'fake-indexeddb/auto';

vi.mock('@yjs/dom', () => ({
  DOMBinding: vi.fn(() => ({
    destroy: vi.fn(),
  })),
}));

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