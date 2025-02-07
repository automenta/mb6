import DB from '../core/DB.js';
import { debounce } from './UIUtil.js';

export default class EditorContent {
    constructor(ytext, object, onUpdate, pluginManager, emitter) {
        this.ytext = ytext;
        this.object = object;
        this.onUpdate = onUpdate;
        this.pluginManager = pluginManager;
        this.emitter = emitter;

        this.contentEditor = document.createElement('div');
        this.contentEditor.el = 'content-editor';
        this.contentEditor.contentEditable = 'true';
        this.contentEditor.innerHTML = this.object?.content ?? '';

        const updateContent = async () => {
            this.object.content = this.ytext.toString();
            await DB.updateObject(this.object);
            this.onUpdate?.(this.object);
            this.emitter.emit('objectUpdated');
        };

        const debouncedUpdateContent = debounce(updateContent, 300);

        this.contentEditor.addEventListener('input', debouncedUpdateContent);
        this.ytext.observe(() => {
            this.contentEditor.innerHTML = this.ytext.toString();
        });
    }

}