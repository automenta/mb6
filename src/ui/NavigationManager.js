export default class NavigationManager {
    constructor(uiManager, views) {
        this.uiManager = uiManager;
        this.views = views;

        this.routes = {
            '#home': () => this.uiManager.setContentView('home'),
            '#nObjects': () => this.uiManager.setContentView('nObjects'),
            '#database': () => this.uiManager.setContentView('database'),
            '#editor': () => this.uiManager.setContentView('editor'), // Add editor route
            '': () => this.uiManager.setContentView('home') // Default to home view
        };
    }

    handleNavigation(route) {

        const routeHandler = this.routes[route] || this.routes[''];


        routeHandler();
    }
}