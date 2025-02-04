import Editor from './Editor.js';

export default class EditorView {
    constructor(objects, pluginManager) {
        this.el = document.createElement('div');
        this.objects = objects;
        this.pluginManager = pluginManager;
        this.editor = null; // Store the editor instance
    }

    render(obj) {
        this.el.innerHTML = ''; // Clear the container

        if (!obj) {
            this.el.textContent = 'No object selected.';
            return;
        }

        this.editor = Editor.createEditor({ // Create and store the editor instance
            object: obj,
            objects: this.objects,
            pluginManager: this.pluginManager
        });

        this.el.appendChild(this.editor.el);


    }
}