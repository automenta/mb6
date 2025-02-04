import DB from '../core/DB.js';

export default class EditorContent {
    constructor({ydoc, ytext, object, onUpdate, pluginManager, emitter}) {
        this.ydoc = ydoc;
        this.ytext = ytext;
        this.object = object;
        this.onUpdate = onUpdate;
        this.pluginManager = pluginManager;
        this.emitter = emitter;

        this.contentEditor = document.createElement('div');
        this.contentEditor.className = 'content-editor';
        this.contentEditor.contentEditable = 'true';
        this.contentEditor.innerHTML = this.object.content ?? '';

        this.ytext.bind(this.contentEditor);

        const updateContent = async () => {
                    this.object.content = this.ytext.toString();
                    await DB.updateObject(this.object);
                    this.onUpdate?.(this.object);
                    this.emitter.emit('objectUpdated');
                };
        this.ytext.observe(updateContent);

        this.contentEditor.addEventListener('input', updateContent);
    }


    get element() {
        return this.contentEditor;
    }
}