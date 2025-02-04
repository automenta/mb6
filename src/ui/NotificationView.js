export default class NotificationView {
    constructor() {
        this.el = document.createElement('ul');
    }

    render(notifications) {
        this.el.innerHTML = ''; // Clear previous content

        if (!notifications || notifications.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No notifications.';
            this.el.appendChild(emptyMessage);
            return;
        }


        notifications
            .map(notification => {
                const notificationItem = document.createElement('li');
                notificationItem.textContent = notification.message;
                return notificationItem;
            })
            .forEach(notificationItem => this.el.appendChild(notificationItem));
    }
}