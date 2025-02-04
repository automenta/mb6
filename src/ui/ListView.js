export default class ListView {
    constructor(objects, pluginManager) {
        this.el = document.createElement('ul');
        this.objects = objects;
        this.pluginManager = pluginManager;
    }

    createListItem(obj) {
        const item = document.createElement('li');
        item.textContent = obj.name;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => { /* TODO */ });
        item.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => this.objects.delete(obj.id) && this.render());
        item.appendChild(deleteButton);

        return item;
    }

    render() {
        this.el.innerHTML = '';
        Array.from(this.objects.values())
            .map(this.createListItem.bind(this))
            .forEach(item => this.el.appendChild(item));
    }
}