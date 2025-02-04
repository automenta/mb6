export default class NavigationManager {
    constructor(uiManager, views) {
        this.uiManager = uiManager;
        this.views = views;

        this.routes = {
            '#home': 'home',
            '#nObjects': 'nObjects',
            '#database': 'database',
            '#settings': 'settings',
            '': 'home' // Default to home view
        };
    }

    getObjectIdFromRoute = route => (route.match(/#editor\/(.*)/) || [])[1];

    handleNavigation = route => {
        let viewName = this.routes[route] || this.routes[''];
        let obj = null;

        if (route.startsWith('#editor/')) {
            viewName = 'editor';
            const objectId = this.getObjectIdFromRoute(route);
            obj = objectId && this.uiManager.getNObject(objectId);
        }

        this.uiManager.setContentView(viewName, obj);

    };
}