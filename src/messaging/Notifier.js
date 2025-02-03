class Notifier {
    static instance;
    listeners = {};

    constructor() {
        if (Notifier.instance) {
            return Notifier.instance;
        }
        Notifier.instance = this;
        this.listeners = {}; // Initialize listeners
        this.container = document.getElementById('notification-container') ?? this.createContainer();
    }

    createContainer() {
        const el = Object.assign(document.createElement('div'), {
            id: 'notification-container',
            style: 'position: fixed; top: 1rem; right: 1rem; z-index: 1000;' // Use string for style
        });
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

        this.emit('notify', message); // Emit the 'notify' event
    }


    on(event, listener) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(listener);
    }

    emit(event, ...args) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener(...args));
        }
    }
}

export { Notifier }; // Export the class