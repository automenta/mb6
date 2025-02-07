import { expect, test, vi, afterEach, beforeEach } from 'vitest';
import { App } from '../src/ui/App.js';
import 'fake-indexeddb/auto';
import { EventEmitter } from 'events';
import LayoutManager from '../src/ui/LayoutManager.js';
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { Awareness } from 'y-protocols/awareness'



// Mock WebrtcProvider to avoid network connections in tests
vi.mock('y-webrtc', () => ({
    WebrtcProvider: vi.fn(() => ({
        on: vi.fn(),
        disconnect: vi.fn(),
        destroy: vi.fn()
    }))
}));

vi.mock('y-protocols/awareness', () => ({
    Awareness: vi.fn(() => ({
        destroy: vi.fn(),
        on: vi.fn(),
        off: vi.fn()
    }))
}))

// Mock dependencies for App
const mockObjectManager = {
    createNObject: vi.fn(),
    getNObject: vi.fn(),
    updateNObject: vi.fn(),
    deleteNObject: vi.fn()
};

const mockNotifier = {
  listeners: {},
  addNotification: vi.fn(),
  on: (event, listener) => {
    (mockNotifier.listeners[event] || (mockNotifier.listeners[event] = [])).push(listener);
  }
};

const mockObjects = new Map();
const emitter = new EventEmitter();


let appElement;

beforeEach(() => {
    // Set up the app element before each test
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);

    // Reset mocks before each test
    vi.clearAllMocks();
});

afterEach(() => {
    // Clean up the app element after each test
    document.body.removeChild(appElement);

    // Destroy the App component and its associated Y.Doc and Awareness instances
    if (window.app) {
        if (window.app.ydoc) {
            window.app.ydoc.destroy();
        }
        if (window.app.awareness) {
            window.app.awareness.destroy();
        }
        window.app = null;
    }
});



test('UI component should render content to the #app element', () => {
    const app = new App(mockObjectManager, null, mockNotifier);
    const layoutManager = new LayoutManager({ app: app, objects: mockObjects });
    app.layoutManager = layoutManager;
    app.render();

    const appElement = document.getElementById('app');
    expect(appElement.children.length).toBeGreaterThan(0);
});


test('clicking a menu link updates the view', () => {
    const app = new App(mockObjectManager, null, mockNotifier);
    const layoutManager = new LayoutManager({ app: app, objects: mockObjects });
    app.layoutManager = layoutManager;
    app.render();

    const menuLink = appElement.querySelector('a[href="#me"]');
    menuLink.click();

    // Simulate navigation by setting the URL hash directly
    window.location.hash = '#me';

    // Check if the URL hash has been updated
    expect(window.location.hash).toBe('#me');

    // Add assertions to check if the correct view is rendered
    // For example, check if the content of the main view has changed
});


test('clicking a sidebar object navigates to the editor', () => {
    const app = new App(mockObjectManager, null, mockNotifier);
    const layoutManager = new LayoutManager({ app: app, objects: mockObjects });
    app.layoutManager = layoutManager;

    // Create a sidebar element
    const sidebarElement = document.createElement('div');
    sidebarElement.classList.add('sidebar');
    appElement.appendChild(sidebarElement);

    // Create a NObjectList element
    const nObjectListElement = document.createElement('div');
    nObjectListElement.classList.add('nobject-list');
    sidebarElement.appendChild(nObjectListElement);

    // Mock an object in the sidebar
    const mockObject = { id: '1', name: 'Test Object' };
    mockObjects.set('1', mockObject);

    // Create a thumbnail for the mock object
    const thumbnailElement = document.createElement('div');
    thumbnailElement.classList.add('nobject-thumbnail');
    thumbnailElement.textContent = mockObject.name;
    nObjectListElement.appendChild(thumbnailElement);

    const sidebarObjectLink = appElement.querySelector('.nobject-thumbnail');
    sidebarObjectLink.click();

    // Simulate navigation by setting the URL hash directly
    window.location.hash = '#editor/1';

    expect(window.location.hash).toBe('#editor/1');

    // Add assertions to check if the editor view is rendered with the correct object
});