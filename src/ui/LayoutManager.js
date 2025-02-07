import { MainView } from './MainView.js';
import Sidebar from './Sidebar.js';
import { HomeView } from './HomeView.js';
import MeView from './MeView.js';
import FriendsView from './FriendsView.js';
import NetworkView from './NetworkView.js';
import NObjectsView from "./NObjectsView.js";
import DatabaseView from "./DatabaseView.js";
import EditorView from "./EditorView.js";
import SettingsView from "./SettingsView.js";
import NotificationManager from "./NotificationManager.js";
import NavigationManager from "./NavigationManager.js";

import './css/styles-theme2.css'


export default class LayoutManager {
    constructor(options) {
        this.app = options;
        this.objects = options.objects;
        this.notifier = options.notifier;
        this.emitter = options.emitter;
        this.views = {};
        this.managers = {};
        this.mainView = new MainView();
        this.navigationManager = this.app.managers.navigationManager;
        this.sidebar = new Sidebar({
            objects: this.objects,
            notifier: this.notifier,
            emitter: this.emitter,
            onNavigate: (route) => {
                this.handleNavigation(route);
            }
        });
        this.initialize();
    }

    initialize() {
        this.initializeViews();
        this.initializeManagers();
        this.setupEventListeners();
    }

    initializeViews() {
        this.views = {
            home: new HomeView(this.app.objects, [], this.app.emitter),
            me: new MeView(this.app.objects, [], this.app.emitter),
            friends: new FriendsView(),
            network: new NetworkView(),
            nObjects: new NObjectsView(this.app.objects),
            database: new DatabaseView(this.app.objects, []),
            editor: new EditorView({object: this.app.objects, emitter: this.app.emitter}),
            settings: new SettingsView({applyStylesheet: filename => this.app.applyStylesheet(filename)})
        };
    }

    initializeManagers() {
        this.managers.notificationManager = new NotificationManager([], this.app.mainView, this.app.notifier);
        this.managers.navigationManager = new NavigationManager(this.app, this.views);
    }

    setupEventListeners() {
        this.sidebar.el.addEventListener('click', (e) => {
            if (e.target.dataset.navigate) {
                this.managers.navigationManager.handleNavigation(e.target.dataset.navigate);
            }
        });
    }

    handleNavigation(route) {
        this.navigationManager.handleNavigation(route);
    }

}