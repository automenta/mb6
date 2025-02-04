export default class EditorMetadata {

    constructor({ object, pluginManager, objects, onSave, ydoc }) {
        this.ydoc = ydoc;
        this.object = object;
        this.pluginManager = pluginManager;
        this.objects = objects;
        this.onSave = onSave;

        this.el = document.createElement('div');
        this.el.className = 'editor-metadata';

        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.className = 'name-input'; // Add class to name input
        this.nameInput.value = this.object.name;
        this.nameInput.placeholder = 'NObject Name';
        this.yname = this.ydoc.getText('name');
        this.yname.insert(0, this.object.name ?? '');
        this.nameInput.value = this.yname.toString();
        this.nameInput.addEventListener('input', () => {
            this.yname.delete(0, this.yname.length);
            this.yname.insert(0, this.nameInput.value);
            this.object.name = this.yname.toString();
            this.onSave?.(this.object);
        });

        this.el.appendChild(this.nameInput);
    }
}