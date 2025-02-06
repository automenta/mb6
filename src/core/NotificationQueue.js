import { nanoid } from 'nanoid';

export default class NotificationQueue {
  static queue = new Map();
  static MAX_HISTORY = 100;
  static listeners = new Set();

  static add(matchData) {
    const id = nanoid();
    const notification = {
      ...matchData,
      id,
      read: false,
      timestamp: Date.now(),
      type: 'match'
    };
    
    this.queue.set(id, notification);
    
    // Trim old entries
    if (this.queue.size > this.MAX_HISTORY) {
      const oldest = Array.from(this.queue.keys())
        .sort((a, b) => this.queue.get(a).timestamp - this.queue.get(b).timestamp)
        [0];
      this.queue.delete(oldest);
    }

    // Notify listeners
    this.listeners.forEach(fn => fn(notification));
  }

  static subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  static markRead(id) {
    const entry = this.queue.get(id);
    if (entry) {
      this.queue.set(id, { ...entry, read: true });
    }
  }

  static getRecent(limit = 20) {
    return Array.from(this.queue.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}