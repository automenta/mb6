export default class NotificationManager {
    constructor(notifications, mainView, notifier) {
        this.notifications = notifications;
        this.mainView = mainView;
        this.notifier = notifier;

        this.notifier.on('notify', message => {
            this.notifications.push({ message, timestamp: Date.now() });
            (location.hash === '#notifications') && this.mainView.setContentView('home', this.notifications);
        });

    }
}