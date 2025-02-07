import View from './View.js';
import NotificationView from './NotificationView.js';

export class HomeView extends View {
    constructor(objects, pluginManager, notifications) {
        super();
        this.el.id = 'home';
        this.notifications = notifications;
        this.notificationView = new NotificationView();
    }

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
