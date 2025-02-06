import NotificationQueue from '../core/NotificationQueue';

export default class NotificationView {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'notification-list';
        this.unsubscribe = NotificationQueue.subscribe(this.update.bind(this));
    }

    render() {

    }

    update(notification) {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        item.innerHTML = `
      <h4>New match for ${notification.candidate.name}</h4>
      <p>Score: ${Math.round(notification.score * 100)}%</p>
      <button data-id="${notification.id}">Mark read</button>
    `;
        this.element.prepend(item);
    }

    destroy() {
        this.unsubscribe();
    }
}
