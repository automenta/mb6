import NotificationQueue from '../core/NotificationQueue';

export class NotificationView {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'notification-list';
    this.unsubscribe = NotificationQueue.subscribe(this.update.bind(this));
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