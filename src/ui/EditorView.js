import Editor from './Editor.js';

/**
 * View for displaying the editor.
 */
export default class EditorView {
    constructor(objects, pluginManager, emitter) {
        this.el = document.createElement('div');
        this.objects = objects;
        this.pluginManager = pluginManager;
        this.emitter = emitter;
        this.editor = null; // Store the editor instance
    }

    /**
     * Renders the editor view.
     * @param {object} obj - The object to edit.
     */
    render(obj) {
        if (this.editor) {
            if (this.editor && this.editor.object.id !== obj.id) {
    this.editor = null;
}
        }

        this.el.innerHTML = ''; // Clear the container

        if (!obj) {
            this.el.textContent = 'No object selected.';
        } else {
            this.editor = new Editor({
                object: obj,
                pluginManager: this.pluginManager,
                emitter: this.emitter
            });
            this.el.appendChild(this.editor.el);
        }
    }
}