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

    createContainer() {
        const el = document.createElement('div');
        el.id = 'notification-container';
        document.body.appendChild(el);
        return el;
    }

    notify(message) {
        const notification = Object.assign(document.createElement('div'), {
            className: 'notification',
            textContent: message
        });
        this.container.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);

        this.emit('notify', message);
    }


    on(event, listener) {
        (this.listeners[event] = this.listeners[event] || []).push(listener);
    }

    emit(event, ...args) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener(...args));
        }
    }
}

export {Notifier};