import {UIPlugins} from './UIPlugins.js'
import Notifier from './Notifier.js'
import {EventEmitter} from 'events'
import LayoutManager from './LayoutManager.js'
import ObjectManager from './ObjectManager.js'
import NavigationManager from './NavigationManager.js'

export class App {
    constructor({ emitter, pluginManager, notifier } = {}) {
        this.emitter = emitter || new EventEmitter();
        this.managers = {};
        this.pluginManager = pluginManager || new UIPlugins();
        this.notifier = notifier || new Notifier();
        this.navigationManager = new NavigationManager();
        this.managers.navigationManager = this.navigationManager;
        this.objects = new Map();
        this.objectManager = new ObjectManager(this.objects, this.pluginManager, null, this.emitter);
        this.layoutManager = new LayoutManager({...this, objects: this.objects});
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
        this.setContentView('nObjects', newNObject); // Updates the NObjects view after creating a new object
        return newNObject;
    }

    getNObject(id) {
        return this.objectManager.getNObject(id);
    }

    updateNObject(id, updates) {
        const updatedNObject = this.objectManager.updateNObject(id, updates);
        this.setContentView('nObjects', updatedNObject); // Updates the NObjects view after updating an object
        return updatedNObject;
    }

    deleteNObject(id) {
        this.objectManager.deleteNObject(id);
        this.setContentView('nObjects'); // Updates the NObjects view after deleting an object
    }

    setContentView(view, obj) {
        this.layoutManager.mainView.setContentView(this.layoutManager.views[view], obj);
    }

    render() {
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.appendChild(this.layoutManager.mainView.el);
        } else {
            console.error('App element not found');
        }
    }

}

const app = new App();
app.render();
