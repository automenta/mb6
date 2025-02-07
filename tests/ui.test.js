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
        on: vi.fn()
    }))
}));

vi.mock('y-protocols/awareness', () => ({
    Awareness: vi.fn(() => ({}))
}))


// Mock dependencies for App
const mockObjectManager = {
    createNObject: vi.fn(),
    getNObject: vi.fn(),
    updateNObject: vi.fn(),
    deleteNObject: vi.fn()
};

const mockNotifier = {
    addNotification: vi.fn()
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

    // Check if the URL hash has been updated
    expect(window.location.hash).toBe('#me');

    // Add assertions to check if the correct view is rendered
    // For example, check if the content of the main view has changed
});


test('clicking a sidebar object navigates to the editor', () => {
    const app = new App(mockObjectManager, null, mockNotifier);
    const layoutManager = new LayoutManager({ app: app, objects: mockObjects });
    app.layoutManager = layoutManager;
    app.render();

    // Mock an object in the sidebar
    const mockObject = { id: '1', name: 'Test Object' };
    mockObjects.set('1', mockObject);
    app.layoutManager.sidebar.nObjectList.render();

    const sidebarObjectLink = appElement.querySelector('.nobject-thumbnail');
    sidebarObjectLink.click();

    expect(window.location.hash).toBe('#editor/1');

    // Add assertions to check if the editor view is rendered with the correct object
});