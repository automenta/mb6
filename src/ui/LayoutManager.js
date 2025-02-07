import { MainView } from './MainView.js';
import Sidebar from './Sidebar.js';
import { HomeView } from './HomeView.js';
import MeView from './MeView.js';
import FriendsView from './FriendsView.js';
import NetworkView from './NetworkView.js';
import NObjectsView from './NObjectsView.js';
import DatabaseView from './DatabaseView.js';
import EditorView from './EditorView.js';
import SettingsView from './SettingsView.js';
import NotificationManager from './NotificationManager.js';

import './css/styles-theme2.css';

export default class LayoutManager {
    constructor({ app, objects }) {
        this.app = app;
        this.objects = objects;
        this.notifier = app.notifier;
        this.emitter = app.emitter;
        this.views = {};
        this.managers = app.managers;
        this.mainView = new MainView();
        this.sidebar = new Sidebar({
            objects: this.objects,
            notifier: this.notifier,
            emitter: this.emitter,
            onNavigate: (route) => {
                this.handleNavigation(route);
            }
        });
    }

    initialize(appElement) {
        this.initializeViews();
        this.setupEventListeners();
        if (appElement) {
            appElement.appendChild(this.sidebar.el);
            appElement.appendChild(this.mainView.el);
        } else {
            console.error('App element not found');
        }
    }

    initializeViews() {
        this.views = {
            home: new HomeView(this.app.objects, [], this.app.emitter),
            me: new MeView(this.app.objects, [], this.app.emitter),
            friends: new FriendsView(),
            network: new NetworkView(),
            nObjects: new NObjectsView(this.app.objects),
            database: new DatabaseView(this.app.objects, []),
            editor: new EditorView({ object: this.app.objects, emitter: this.app.emitter }),
            settings: new SettingsView({ applyStylesheet: filename => this.app.applyStylesheet(filename) })
        };
    }

    setupEventListeners() {
        this.sidebar.el.addEventListener('click', (e) => {
            if (e.target.dataset.navigate) {
                this.handleNavigation(e.target.dataset.navigate);
            }
        });
    }

    handleNavigation(route) {
        this.app.handleNavigation(route);
    }
}