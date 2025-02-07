import NotificationView from './NotificationView.js';

/**
 * View for displaying the home page.
 */
export class HomeView {
    constructor(objects, pluginManager, notifications) {
        this.el = document.createElement('div');
        this.el.id = 'home';
        this.notifications = notifications;

        this.notificationView = new NotificationView();
    }

    /**
     * Renders the home view.
     */
    render() {
        this.el.innerHTML = '';
        if (this.notifications && this.notifications.length > 0) {
            this.notificationView.render(this.notifications);
            this.el.appendChild(this.notificationView.element);
        } else {
            const placeholder = document.createElement('div');
            placeholder.innerText = 'Welcome to the Home Page!';
            this.el.appendChild(placeholder);
        }
    }
}
