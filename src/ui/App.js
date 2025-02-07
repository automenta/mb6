import { EventEmitter } from 'events';
import LayoutManager from './LayoutManager.js';
import Notifier from './Notifier.js';
import ObjectManager from './ObjectManager.js';
import {WebrtcProvider} from 'y-webrtc';
import { Awareness } from 'y-protocols/awareness.js';

import * as Y from 'yjs'

export class App {
    constructor(objectManager, layoutManager, notifier) {
        this.ydoc = new Y.Doc()
        this.emitter = new EventEmitter();
        this.objects = new Map();
        this.objectManager = objectManager;
        this.notifier = notifier;
        this.layoutManager = layoutManager;
        
        this.webrtc = new WebrtcProvider(
            'nobject-editor-room', // room name
            this.ydoc,
            {
                signaling: [
                    //'wss://signaling.yjs.dev',
                    //'ws://localhost:4444'
                ],
                awareness: new Awareness(this.ydoc)
            }
        );

        this.webrtc.on('synced', () => {
            console.log('WebRTCProvider synced');
        });
this.webrtc.on('peers', peers => {
    console.log('Current peers:', peers);
});

}


    applyStylesheet(filename) {
        document.querySelectorAll('link[rel="stylesheet"][data-theme]').forEach(link => link.remove());
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `src/ui/css/${filename}`;
        document.head.appendChild(link);
    }

    createNObject(name, content, properties, tags) {
        var newNObject = this.objectManager.createNObject(name, content, properties, tags);
        this.layoutManager.setMessageView('nObjects', newNObject);
        return newNObject;
    }

    getNObject(id) {
        return this.objectManager.getNObject(id);
    }

    updateNObject(id, updates) {
        var updatedNObject = this.objectManager.updateNObject(id, updates);
        this.layoutManager.setMessageView('nObjects', updatedNObject);
        return updatedNObject;
    }

    deleteNObject(id) {
        this.objectManager.deleteNObject(id);
        this.layoutManager.setMessageView('nObjects', '');
    }
    
    handleNavigation = route => {
        const viewName = route.substring(1) || 'home';
        let obj = null;

        if (viewName.startsWith('editor/')) {
            var objId = viewName.substring('editor/'.length);
            obj = this.getNObject(objId);
            this.layoutManager.setContentView('editor', obj); // Pass viewName to LayoutManager
        } else {
            this.layoutManager.setContentView(viewName, null); // Pass viewName to LayoutManager
        }
    };
    render() {
        var appElement = document.getElementById('app');
        if (appElement) {
            this.layoutManager.initialize(appElement);
            this.handleNavigation(window.location.hash);
            window.addEventListener('hashchange', () => {
                this.handleNavigation(window.location.hash);
            });
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
const layoutManager = new LayoutManager({ app: app, objects: objects });
app.layoutManager = layoutManager;

app.render();

