import Editor from './Editor.js';

export default class EditorView {
    constructor(objects, pluginManager, emitter, app) {
        this.el = document.createElement('div');
        this.objects = objects;
        this.pluginManager = pluginManager;
        this.emitter = emitter;
        this.app = app;
        this.editor = null;
    }

    render(obj) {
        if (this.editor) {
            if (this.editor && this.editor.object.id !== obj.id) {
                this.editor = null;
            }
        }

        this.el.innerHTML = '';

        if (!obj) {
            this.el.textContent = 'No object selected.';
        } else {
            this.editor = new Editor({
                object: obj,
                pluginManager: this.pluginManager,
                emitter: this.emitter,
                app: this.app
            });
            this.el.appendChild(this.editor.el);
        }
    }
}