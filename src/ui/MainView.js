export default class MainView {
    constructor({onCreate, onEdit}) {
        this.onCreate = onCreate;
        this.onEdit = onEdit;
        this.el = document.createElement('div');
        this.el.id = 'main-view';
    }

    renderNObjects(objects) {
        this.el.innerHTML = '';
        const btn = document.createElement('button');
        btn.textContent = 'Create NObject';
        btn.addEventListener('click', this.onCreate);
        const list = document.createElement('ul');
        list.id = 'nobjects-list';
        objects.forEach(obj => {
            const li = document.createElement('li');
            li.textContent = obj.name;
            li.addEventListener('click', () => this.onEdit(obj));
            list.appendChild(li);
        });
        this.el.append(btn, list);
    }

    renderNotifications(notifications) {
        this.el.innerHTML = '';
        const header = document.createElement('h2');
        header.textContent = 'Notifications';
        const list = document.createElement('ul');
        list.id = 'notifications-list';
        notifications.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.message} (${new Date(item.timestamp).toLocaleTimeString()})`;
            list.appendChild(li);
        });
        this.el.append(header, list);
    }

    renderDatabase(objects) {
        this.el.innerHTML = '<h2>Database View</h2>';
        // TODO: Implement sortable and filterable data views for NObjects.
        // - Add UI elements for sorting (e.g., dropdown menus, column headers).
        // - Implement filtering based on NObject properties and tags (e.g., search bar, filter panels).
        // - Consider using a library for data table/grid functionality.

        // TODO: Implement sortable and filterable data views for NObjects
        const list = document.createElement('ul');
        list.id = 'database-list';
        objects.forEach(obj => {
            const li = document.createElement('li');
            li.textContent = obj.name; // Basic display, needs to be enhanced
            list.appendChild(li);
        });
        this.el.append(list);
    }

    renderFriendsUpdates() {
        this.el.innerHTML = '<h2>Friends Updates</h2><p>Coming soon...</p>';
        // TODO: Implement UI for displaying connection updates from friends.
        // - Display a list of friends with their connection status (online, offline, pending).
        // - Show recent updates or status changes from friends.
        // - Consider using visual cues (e.g., icons, colors) to indicate status.

        // TODO: Implement UI for displaying connection updates from friends
    }

    renderNetworkActivity() {
        this.el.innerHTML = '<h2>Network Activity</h2><p>Coming soon...</p>';
        // TODO: Implement UI for displaying network activity.
        // - Show real-time network events (e.g., peer connections, disconnections, message exchanges).
        // - Display network statistics (e.g., data usage, latency).
        // - Consider using graphs or charts to visualize network activity.

        // TODO: Implement UI for displaying network activity
    }

    renderEditor(editorEl) {
        this.el.innerHTML = '';
        this.el.append(editorEl);
    }
}