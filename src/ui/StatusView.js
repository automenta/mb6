export default class StatusView {
    constructor(notifier) {
        this.notifier = notifier;
        this.el = document.createElement('div');
        this.el.id = 'status-view';

        this.networkStatus = this.el.appendChild(document.createElement('p'));
        this.networkStatus.textContent = 'Network: Connecting...';

        this.notifier.on('networkStatus', status => this.networkStatus.textContent = `Network: ${status}`);

        this.objectCount = this.el.appendChild(document.createElement('p'));
        this.objectCount.textContent = 'Objects: 0';

        this.ownedObjectCount = this.el.appendChild(document.createElement('p'));
        this.ownedObjectCount.textContent = 'Owned Objects: 0';

    }

    updateObjectCounts = (totalCount, ownedCount) => {
        this.objectCount.textContent = `Objects: ${totalCount}`;
        this.ownedObjectCount.textContent = `Owned Objects: ${ownedCount}`;
    };
}