export default class Notifier {
    static notify(message) {
        const container = document.getElementById('notification-container') ?? (() => {
            const el = document.createElement('div');
            el.id = 'notification-container';
            Object.assign(el.style, {position: 'fixed', top: '1rem', right: '1rem', zIndex: '1000'});
            document.body.appendChild(el);
            return el;
        })();
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        container.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}
        