export default class StatusView {
    constructor(notifier) {
        this.notifier = notifier;
        this.el = document.createElement('div');
        this.el.id = 'status-view';
        this.el.textContent = 'No notifications';

        if (this.notifier) {
            this.notifier.on('notification', (message) => {
                this.el.textContent = message;
            });
        } else {
            console.error('Notifier is not initialized');
        }
    }
}