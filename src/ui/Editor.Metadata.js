import * as Y from 'yjs';
import DB from '../core/DB.js';


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
        this.nameInput.value = this.object.name;
        this.nameInput.placeholder = 'NObject Name';
this.yname = this.ydoc.getText('name');
this.yname.insert(0, this.object.name ?? '');
this.nameInput.value = this.yname.toString();
this.yname.observe(() => {
    this.object.name = this.yname.toString();


console.log('onSave called', this.object);
    if (this.onSave) {
        this.onSave(this.object);
    }
});

this.nameInput.addEventListener('input', () => {
    this.yname.delete(0, this.yname.length);
    this.yname.insert(0, this.nameInput.value);
});

        this.el.appendChild(this.nameInput);


    }

    get element() {
        return this.el;
    }


}