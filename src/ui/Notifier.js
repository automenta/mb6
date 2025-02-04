export default class Notifier {
    static instance;
    listeners = {};

    constructor() {
        if (Notifier.instance) {
            return Notifier.instance;
        }
        Notifier.instance = this;
        this.listeners = {};
        this.container = document.getElementById('notification-container') ?? this.createContainer();
    }

    createContainer = () => {
        const container = document.body.appendChild(document.createElement('div'));
        container.id = 'notification-container';
        return container;
    };

    notify = message => {
        const notification = this.container.appendChild(document.createElement('div'));
        notification.className = 'notification';
        notification.textContent = message;
        setTimeout(() => notification.remove(), 3000);
        this.emit('notify', message);

    };


    on = (event, listener) => {
        (this.listeners[event] || (this.listeners[event] = [])).push(listener);

    };

    emit = (event, ...args) => {
        this.listeners[event]?.forEach(listener => listener(...args));
    };
}

export {Notifier};