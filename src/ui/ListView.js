export default class ListView {
    constructor(objects, pluginManager) {
        this.el = document.createElement('ul');
        this.objects = objects;
    }

    createListItem = obj => {
        const item = document.createElement('li');
        item.textContent = obj.name;
        item.dataset.id = obj.id;

        const editButton = item.appendChild(document.createElement('button'));
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => this.handleEditClick(obj));

        const deleteButton = item.appendChild(document.createElement('button'));
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => this.handleDeleteClick(obj));

        return item;
    };

    handleEditClick(obj) {
        window.location.hash = `#editor/${obj.id}`;
    }

    handleDeleteClick(obj) {
        DB.deleteObject(obj);
    }

    render = () => {
        this.el.innerHTML = '';
        Array.from(this.objects.values()).map(this.createListItem).forEach(item => this.el.appendChild(item));
    };
    addObject = (obj) => {
        const item = this.createListItem(obj);
        this.el.appendChild(item);
    };

    updateObject = (obj) => {
        const item = this.el.querySelector(`[data-id='${obj.id}']`);
        if (item) {
            item.textContent = obj.name;
        }
    };

    deleteObject = (id) => {
        const item = this.el.querySelector(`[data-id='${id}']`);
        if (item) {
            item.remove();
        }
    };
}