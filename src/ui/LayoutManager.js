import Sidebar from './Sidebar.js';
import { HomeView } from './HomeView.js';
import MeView from './MeView.js';
import FriendsView from './FriendsView.js';
import NetworkView from './NetworkView.js';
import NObjectsView from './NObjectsView.js';
import DatabaseView from './DatabaseView.js';
import EditorView from './EditorView.js';
import SettingsView from './SettingsView.js';

import './css/styles-theme2.css';

export default class LayoutManager {
    constructor({ app, objects }) {
        this.app = app;
        this.objects = objects;
        this.notifier = app.notifier;
        this.emitter = app.emitter;
        this.contentContainer = document.createElement('div');
        this.contentContainer.id = 'content-container';
        this.views = {};
        this.sidebar = new Sidebar({
            objects: this.objects,
            notifier: this.notifier,
            emitter: this.emitter,
            onNavigate: (route) => {
                this.app.handleNavigation(route); // Call app.handleNavigation directly
            }
        });
    }

    initialize(appElement) {
        this.initializeViews();
        this.setupEventListeners();
        if (appElement) {
            appElement.appendChild(this.sidebar.el);
            appElement.appendChild(this.contentContainer);
        } else {
            console.error('App element not found');
        }
    }

    initializeViews() {
        this.views = {
            home: new HomeView(this.app.objects, [], this.app.emitter),
            me: new MeView('Welcome to the Me Page!'),
            friends: new FriendsView('Welcome to the Friends Page!'),
            network: new NetworkView('Welcome to the Network Page!'),
            nObjects: new NObjectsView(this.app.objects),
            database: new DatabaseView(this.app.objects, []),
            editor: new EditorView(this.app.objects, null, this.app.emitter, this.app),
            settings: new SettingsView({ applyStylesheet: filename => this.app.applyStylesheet(filename) })
        };
    }

    setupEventListeners() {
        // No need for handleNavigation here anymore
    }


    setContentView(viewName, obj) {
        this.contentContainer.innerHTML = '';
        const view = this.views[viewName];
        if (view) {
            view.render(obj);
            this.contentContainer.appendChild(view.el);
        } else {
            console.error(`View ${viewName} not found`);
        }
    }
}