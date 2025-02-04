export default class NotificationView {
    constructor() {
        this.el = document.createElement('ul');
    }

    render = notifications => {
        this.el.innerHTML = '';

        if (!notifications || !notifications.length) {
            this.el.appendChild(document.createElement('li')).textContent = 'No notifications.';
            return;
        }

        notifications.forEach(notification => this.el.appendChild(document.createElement('li')).textContent = notification.message);

    };
}