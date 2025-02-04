import NotificationView from './NotificationView.js';


export class HomeView {
    constructor(objects, pluginManager, notifications) {
        this.el = document.createElement('div');
        this.el.id = 'home';
        this.objects = objects;
        this.pluginManager = pluginManager;
        this.notifications = notifications;

        this.notificationView = new NotificationView();


    }
render() {
    this.el.innerHTML = '';
    this.notificationView.render(this.notifications);
    this.el.appendChild(this.notificationView.el);
}


}
