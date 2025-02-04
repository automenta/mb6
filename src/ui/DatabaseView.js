export default class DatabaseView {
    constructor(objects, pluginManager) {
        this.el = document.createElement('div');
        this.objects = objects;
        this.pluginManager = pluginManager;

    }

    render() {
        this.el.innerHTML = '';

        const objectList = Array.from(this.objects.values());

        if (!objectList.length) {
            this.el.textContent = 'No objects in the database.';
            return;
        }

        const ul = this.el.appendChild(document.createElement('ul'));
        objectList.map(obj => {
            const li = document.createElement('li');
            li.textContent = `Object ID: ${obj.id}, Content: ${obj.content}`;
            return li;
        }).forEach(li => ul.appendChild(li));


    }
}