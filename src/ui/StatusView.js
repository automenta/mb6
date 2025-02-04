import Notifier from './Notifier.js';

export default class StatusView {
    constructor(notifier) {
        this.notifier = notifier;
        this.el = document.createElement('div');
        this.el.id = 'status-view';

        this.networkStatus = document.createElement('p');
        this.networkStatus.textContent = 'Network: Connecting...';
        this.el.appendChild(this.networkStatus);


        this.notifier.on('networkStatus', status => {
            this.networkStatus.textContent = `Network: ${status}`;
        });

        this.objectCount = document.createElement('p');
        this.objectCount.textContent = 'Objects: 0';
        this.el.appendChild(this.objectCount);

        this.ownedObjectCount = document.createElement('p');
        this.ownedObjectCount.textContent = 'Owned Objects: 0';

        this.el.appendChild(this.ownedObjectCount)
    }


    updateObjectCounts(totalCount, ownedCount) {
        this.objectCount.textContent = `Objects: ${totalCount}`;
        this.ownedObjectCount.textContent = `Owned Objects: ${ownedCount}`;
    }
}