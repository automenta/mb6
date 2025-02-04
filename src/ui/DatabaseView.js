export default class DatabaseView {
    constructor(objects, pluginManager) {
        this.el = document.createElement('div');
        this.objects = objects;
        this.pluginManager = pluginManager;

    }

    render() {
        this.el.innerHTML = ''; // Clear previous content


        const objectList = Array.from(this.objects.values());

        if (objectList.length === 0) {
            this.el.textContent = 'No objects in the database.';
            return;
        }


        const ul = document.createElement('ul');
        objectList.forEach(obj => {
            const li = document.createElement('li');
            li.textContent = `Object ID: ${obj.id}, Content: ${obj.content}`;
            ul.appendChild(li);
        });

        this.el.appendChild(ul);

    }
}