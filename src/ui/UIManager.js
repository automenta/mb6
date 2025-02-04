import { MainView } from './MainView.js';
import { HomeView } from './HomeView.js';
import NObjectsView from './NObjectsView.js';
import EditorView from './EditorView.js';
import DatabaseView from './DatabaseView.js';
import Sidebar from './Sidebar.js';
import NavigationManager from './NavigationManager.js';
import ObjectManager from './ObjectManager.js';
import NotificationManager from './NotificationManager.js';

export class UIManager {
    constructor(pluginManager, notifier) {
        this.pluginManager = pluginManager;
        this.notifier = notifier;

        this.objects = new Map();
        this.notifications = [];

        this.mainView = new MainView();
        this.views = {
            home: new HomeView(this.objects, this.pluginManager, this.notifications),
            nObjects: new NObjectsView(this.objects, this.pluginManager),
            database: new DatabaseView(this.objects, this.pluginManager),
            editor: new EditorView(this.objects, this.pluginManager) // EditorView needs objects and pluginManager
        };


        this.nObjectsView = this.views.nObjects; // Assign nObjectsView for ObjectManager
        this.objectManager = new ObjectManager(this.objects, this.pluginManager, this.nObjectsView);
        this.notificationManager = new NotificationManager(this.notifications, this.mainView, this.notifier);


        this.navigationManager = new NavigationManager(this, this.views); // Pass UIManager and views to NavigationManager

        this.sidebar = new Sidebar({
            onNavigate: route => this.navigationManager.handleNavigation(route),
            objects: this.objects,
            views: this.views // Pass views to Sidebar
        });

        document.body.append(this.sidebar.el, this.mainView.el); // Append to body

        window.addEventListener('hashchange', () => this.navigationManager.handleNavigation(location.hash));
        this.navigationManager.handleNavigation(location.hash);


    }

    setContentView(viewName) {
        const view = this.views[viewName];
        if (view) {
            this.mainView.setContentView(view);
        } else {
            console.warn('Unknown view:', viewName);
        }
    }



}