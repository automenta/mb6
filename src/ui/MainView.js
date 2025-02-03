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

    renderDatabase() {
        this.el.innerHTML = '<h2>Database View</h2><p>Coming soon...</p>';
    }

    renderEditor(editorEl) {
        this.el.innerHTML = '';
        this.el.append(editorEl);
    }
}
        