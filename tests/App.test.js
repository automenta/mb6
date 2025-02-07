import * as Y from 'yjs';
import NObject from '../src/core/NObject.js';
import { expect, test, vi } from 'vitest';
import { App } from '../src/ui/App.js';
import { EventEmitter } from 'events';
import Notifier from '../src/ui/Notifier.js';
import 'fake-indexeddb/auto';
const mockObjectManager = {
    createNObject: vi.fn(() => ({ name: 'Test NObject' })),
    getNObject: vi.fn(),
    updateNObject: vi.fn(),
    deleteNObject: vi.fn()
};

test('App can be instantiated', () => {
    const emitter = new EventEmitter();
    const pluginManager = { emit: vi.fn() };
    const notifier = {
      listeners: {},
      addNotification: vi.fn(),
      on: (event, listener) => {
        (notifier.listeners[event] || (notifier.listeners[event] = [])).push(listener);
      }
    };
    const app = new App(mockObjectManager, null, new Notifier());
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
    let contentContainer;
    const mockObjects = new Map();
    const app = new App(mockObjectManager, null, new Notifier());
    const layoutManager = {
        initialize: (appElement) => {
            contentContainer = document.createElement('div');
            contentContainer.id = 'content-container';
            appElement.appendChild(contentContainer);
        },
        setContentView: vi.fn(),
        setMessageView: (viewName, obj) => {
            const view = { el: document.createElement('div') };
            view.el.textContent = obj.name;
            contentContainer.appendChild(view.el);
        },
        sidebar: {
            nObjectList: {
                render: vi.fn()
            }
        }
    };
    app.layoutManager = layoutManager;
    app.render();


    const mainView = document.getElementById('main-view');
    expect(mainView).toBeDefined();

    contentContainer = document.getElementById('content-container');
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
    let contentContainer;
    const mockObjects = new Map();
    const app = new App(mockObjectManager, null, new Notifier());
    const layoutManager = {
        initialize: (appElement) => {
            contentContainer = document.createElement('div');
            contentContainer.id = 'content-container';
            appElement.appendChild(contentContainer);
        },
        setContentView: vi.fn(),
        setMessageView: (viewName, obj) => {
            const view = { el: document.createElement('div') };
            view.el.textContent = obj.name;
            contentContainer.appendChild(view.el);
        },
        sidebar: {
            nObjectList: {
                render: vi.fn()
            }
        }
    };
    app.layoutManager = layoutManager;

    app.render();


    const tags = new Y.Map();
    const nObject = new NObject('test-id', 'Test NObject', 'Test Content', tags, 'test-author');
    app.createNObject('Test NObject', 'Test Content', {}, tags);

    contentContainer = document.getElementById('content-container');
    expect(contentContainer.children.length).toBeGreaterThan(0);

    // Clean up the app element after the test
    document.body.removeChild(appElement);
});


test('App initializes notifier', () => {
    const emitter = new EventEmitter();
    const pluginManager = { emit: vi.fn() };
    const notifier = { 
        addNotification: vi.fn(), 
        on: vi.fn((event, callback) => {}) // Mock the on method
    };
    const app = new App(mockObjectManager, null, notifier);
    
    expect(app.notifier).toBeDefined();
    expect(app.notifier.addNotification).toBeInstanceOf(Function);
    expect(app.notifier.on).toBeInstanceOf(Function);
});