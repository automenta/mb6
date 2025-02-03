class BaseRenderer {
    constructor(elId) {
        this.el = document.getElementById(elId) || document.createElement('div');
        if (!this.el.id) {
            this.el.id = elId;
            document.body.appendChild(this.el); // Append only if newly created
        }
    }

    clear() {
        this.el.innerHTML = '';
    }

    render(data) {
        this.clear();
        this.el.appendChild(this.createContent(data));
    }

    createContent(data) {
        // To be implemented by subclasses
        return document.createElement('div');
    }
}


class NObjectRenderer extends BaseRenderer {
    constructor({onCreate, onEdit}) {
        super('nobjects-view');
        this.onCreate = onCreate;
        this.onEdit = onEdit;
    }

    createContent(objects) {
        const container = document.createElement('div');
        const btn = document.createElement('button');
        btn.textContent = 'Create NObject';
        btn.addEventListener('click', this.onCreate);
        const list = document.createElement('ul');
        list.id = 'nobjects-list';
        objects.forEach(obj => {
            const li = Object.assign(document.createElement('li'), {textContent: obj.name});
            li.addEventListener('click', () => this.onEdit(obj));
            list.appendChild(li);
        });
        container.append(btn, list);
        return container;
    }
}

class NotificationRenderer extends BaseRenderer {
    constructor() {
        super('notifications-view');
    }

    createContent(notifications) {
        const container = document.createElement('div');
        const header = document.createElement('h2');
        header.textContent = 'Notifications';
        const list = document.createElement('ul');
        list.id = 'notifications-list';
        notifications.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.message} (${new Date(item.timestamp).toLocaleTimeString()})`;
            list.appendChild(li);
        });
        container.append(header, list);
        return container;
    }
}

class MainView {
    constructor() {
        this.nObjectRenderer = new NObjectRenderer({}); // onCreate and onEdit will be set later
        this.notificationRenderer = new NotificationRenderer();
        this.el = document.createElement('div');
        this.el.id = 'main-view';
        this.el.append(this.nObjectRenderer.el, this.notificationRenderer.el);


        // Database View
        this.dbView = document.createElement('div');
        this.dbView.id = 'database-view';
        this.el.appendChild(this.dbView);
    }

    renderNObjects(objects) {
        this.nObjectRenderer.render(objects);
    }

    renderEditor(editorElement) {
        this.clearMainViewContent();
        this.el.appendChild(editorElement);
    }

    renderNotifications(notifications) {
        this.notificationRenderer.render(notifications);
    }

    /** TODO create DBView.js */
    renderDatabase(items) {
        this.clearMainViewContent();

        this.dbView.innerHTML = ''; // Clear previous content

        if (items && items.length > 0) {
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'database-item';
                itemDiv.textContent = item.name; // Or other relevant data
                this.dbView.appendChild(itemDiv);
            });
        } else {
            this.dbView.textContent = 'No items in the database.';
        }

        this.el.appendChild(this.dbView);
    }

    clearMainViewContent() {
        // Clear everything except the renderers themselves
        this.el.innerHTML = '';
        this.el.append(this.nObjectRenderer.el, this.notificationRenderer.el, this.dbView);
    }

    setNObjectRendererHandlers({onCreate, onEdit}) {
        this.nObjectRenderer.onCreate = onCreate;
        this.nObjectRenderer.onEdit = onEdit;
    }
}


export {MainView, NObjectRenderer, NotificationRenderer};