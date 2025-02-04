import * as Y from 'yjs';
import DB from '../core/DB.js';

export default class EditorContent {
    constructor({ ydoc, ytext, object, onUpdate, pluginManager }) {
        this.ydoc = ydoc;
        this.ytext = ytext;
        this.object = object;
        this.onUpdate = onUpdate;
        this.pluginManager = pluginManager;

        this.contentEditor = document.createElement('div');
        this.contentEditor.className = 'content-editor';
        this.contentEditor.contentEditable = 'true';
        this.contentEditor.innerHTML = this.object.content ?? '';

        this.ytext.bind(this.contentEditor);

        const updateContent = () => {
            this.object.content = this.ytext.toString();
            DB.updateObject(this.object).then(() => {
                this.onUpdate?.(this.object);
                this.pluginManager?.emit('objectUpdated', this.object);
            });
        };

        this.ytext.observe(updateContent);

        this.contentEditor.addEventListener('input', updateContent);
    }


    get element() {
        return this.contentEditor;
    }
}