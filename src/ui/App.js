import { EventEmitter } from 'events';
import LayoutManager from './LayoutManager.js';
import Notifier from './Notifier.js'; // Ensure Notifier is imported
import ObjectManager from './ObjectManager.js';

export class App {
    constructor(objectManager, layoutManager, notifier) {
        this.emitter = new EventEmitter();
        this.objects = new Map();
        this.objectManager = objectManager;
        this.notifier = notifier; // Initialize notifier
        this.managers = {
            objectManager: this.objectManager
        };
        this.layoutManager = layoutManager;

        this.routes = {
            '#home': 'home',
            '#me': 'me',
            '#friends': 'friends',
            '#network': 'network',
            '#nObjects': 'nObjects',
            '#database': 'database',
            '#settings': 'settings',
            '': 'home' // Default to home view
        };
    }

    applyStylesheet(filename) {
        document.querySelectorAll('link[rel="stylesheet"][data-theme]').forEach(link => link.remove());
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `src/ui/css/${filename}`;
        document.head.appendChild(link);
    }

    createNObject(name, content, properties, tags) {
        const newNObject = this.objectManager.createNObject(name, content, properties, tags);
        this.layoutManager.setMessageView('nObjects', newNObject); // Updates the NObjects view after creating a new object
        return newNObject;
    }

    getNObject(id) {
        return this.objectManager.getNObject(id);
    }

    updateNObject(id, updates) {
        const updatedNObject = this.objectManager.updateNObject(id, updates);
        this.layoutManager.setMessageView('nObjects', updatedNObject); // Updates the NObjects view after updating an object
        return updatedNObject;
    }

    deleteNObject(id) {
        this.objectManager.deleteNObject(id);
        this.layoutManager.setMessageView('nObjects', ''); // Updates the NObjects view after deleting an object
    }

    getObjectIdFromRoute = route => (route.match(/#editor\/(.*)/) || [])[1];

    handleNavigation = route => {
        let viewName = this.routes[route] || this.routes[''];
        let obj = null;

        if (route.startsWith('#editor/')) {
            viewName = 'editor';
            const objectId = this.getObjectIdFromRoute(route);
            obj = objectId && this.objectManager.getNObject(objectId);
        }

        this.layoutManager.mainView.setContentView(this.layoutManager.views[viewName], obj);

    };

    render() {
        const appElement = document.getElementById('app');
        if (appElement) {
            this.layoutManager.initialize(appElement);
            this.handleNavigation(window.location.hash);
        } else {
            console.error('App element not found');
        }
    }
}

const objects = new Map();
const emitter = new EventEmitter();
const objectManager = new ObjectManager(objects, emitter);
const notifier = new Notifier(); // Initialize notifier

const app = new App(objectManager, null, notifier);
const layoutManager = new LayoutManager({ app: app, objects: objects }); // Pass null for now, will be updated later
app.layoutManager = layoutManager;

app.render();
