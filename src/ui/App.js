import './css/styles-theme2.css'
import { MainView } from './MainView.js'
import { HomeView } from './HomeView.js'
import MeView from './MeView.js';
import FriendsView from './FriendsView.js';
import NetworkView from './NetworkView.js'
import NObjectsView from './NObjectsView.js'
import EditorView from './EditorView.js'
import DatabaseView from './DatabaseView.js'
import Sidebar from './Sidebar.js'
import NavigationManager from './NavigationManager.js'
import ObjectManager from './ObjectManager.js'
import NotificationManager from './NotificationManager.js'
import { UIPlugins } from './UIPlugins.js'
import Notifier from './Notifier.js'
import NObject from '../core/NObject.js'
import { EventEmitter } from 'events'
import SettingsView from './SettingsView.js';
import UIBuilder from './UIBuilder.js';

class NetLayer {
  constructor() {
    this.connections = new Map();
    this.peerId = null;
  }

  connectToPeer(peerId) {
    if (this.connections.has(peerId)) return;
    
    const connection = new RTCPeerConnection({
      iceServer: [
        {
          urls: ['stun:example.com', 'turn:example.com'],
        },
      ],
    });

    connection.onicecandidate = (event) => {
      this.connections.set(event.target.peerId, event.target);
    };

    connection.onmessage = (event) => {
      console.log('Received message:', event.data);
      // Handle received data
    };

    connection.start();
    
    this.connections.set(peerId, connection);
  }

  sendToPeer(peerId, data) {
    if (!this.connections.has(peerId)) return;
    
    const connection = this.connections.get(peerId);
    connection.send(data);
  }
}

export class App {
  constructor() {
    this.pluginManager = new UIPlugins();
    this.notifier = new Notifier();
    this.emitter = new EventEmitter();
    this.objects = new Map();
    this.notifications = [];
    
    // Initialize network layer
    this.netLayer = new NetLayer();

    this.mainView = new MainView();
    this.views = {
      home: new HomeView(this.objects, this.pluginManager, this.notifications),
      me: new MeView(),
      friends: new FriendsView(),
      network: new NetworkView(),
      nObjects: new NObjectsView(this.objects, this.pluginManager),
      database: new DatabaseView(this.objects, this.pluginManager),
      editor: new EditorView(this.objects, this.pluginManager, this.emitter),
      settings: new SettingsView({ applyStylesheet: filename => this.applyStylesheet(filename) })
    };

    this.nObjectsView = this.views.nObjects;
    this.objectManager = new ObjectManager(this.objects, this.pluginManager, this.nObjectsView, this.emitter);
    this.notificationManager = new NotificationManager(this.notifications, this.mainView, this.notifier);

    this.sidebar = new Sidebar({
      onNavigate: route => this.navigationManager.handleNavigation(route),
      objects: this.objects,
      views: this.views,
      notifier: this.notifier,
      uiManager: this,
      emitter: this.emitter
    });

    document.body.append(this.sidebar.el, this.mainView.el);

    window.addEventListener('hashchange', () => this.navigationManager.handleNavigation(location.hash));
    this.navigationManager.handleNavigation(location.hash);
  }

  applyStylesheet(filename) {
    document.querySelectorAll('link[rel="stylesheet"][data-theme]').forEach(link => link.remove());
    const link = document.head.appendChild(document.createElement('link'));
    link.rel = 'stylesheet';
    link.dataset.theme = true;
    link.href = `src/ui/css/${filename}`;
  }

  createNObject(name, content, properties, tags) {
    const newNObject = this.objectManager.createNObject(name, content, properties, tags);
    this.setContentView('nObjects', newNObject); // Or whichever view should display the new object
    return newNObject;
  }

  getNObject(id) {
    return this.objectManager.getNObject(id);
  }

  updateNObject(id, updates) {
    const updatedNObject = this.objectManager.updateNObject(id, updates);
    this.setContentView('nObjects', updatedNObject); // Or whichever view should display the updated object
    return updatedNObject;
  }

  deleteNObject(id) {
    this.objectManager.deleteNObject(id);
    this.setContentView('nObjects'); // Or whichever view should display the updated list of objects
  }

  setContentView(viewName, obj) {
    const view = this.views[viewName];
    if (!view) {
      throw new Error(`Unknown view: ${viewName}`);
    }
    this.mainView.setContentView(view, obj);
  }
}
