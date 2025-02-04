import * as Y from 'yjs';
import DB from '../core/DB.js';
import EditorToolbar from './Editor.Toolbar.js';
import EditorMetadata from './Editor.Metadata.js';

export default class Editor {
    constructor({ object, pluginManager, objects, emitter }) {
        this.el = this._createElement(object);
        this.object = object;
        this.ydoc = new Y.Doc();
        this.pluginManager = pluginManager;
        this.objects = objects;
        this.emitter = emitter;

        this.metadata = new EditorMetadata({ object, pluginManager, objects, onSave: this.saveObject, ydoc: this.ydoc });
        this.toolbar = new EditorToolbar({});

        this.ytext = this.ydoc.getText('content');
        this.savedIndicator = document.createElement('span');
        this.savedIndicator.textContent = 'Saved';

        this.el.prepend(this.toolbar.el);
        this.el.prepend(this.metadata.element);
        this.el.appendChild(this.savedIndicator);



        this.ytext.insert(0, this.object.content ?? '');
        this.contentEditor.value = this.ytext.toString();

        this.ytext.observe(async () => {
            if (this.object.content !== this.ytext.toString()) {
                this.object.content = this.ytext.toString();
                this.savedIndicator.textContent = 'Saving...';
                await DB.updateObject(this.object);
                this.emitter.emit('objectUpdated');
                this.savedIndicator.textContent = 'Saved';
            }
        });
        this.savedIndicator.textContent = 'Saved';

        this.contentEditor.addEventListener('input', () => {
            this.ytext.delete(0, this.ytext.length);
            this.ytext.insert(0, this.contentEditor.value);
        });
    }


    saveObject = async (object) => {
        await DB.updateObject(object);
        this.emitter.emit('objectUpdated');
    }

    insertSemantic = (object, value) => {
        // Handle semantic insertion
        console.log('Insert semantic', object, value);
    }

    signObject = (object) => {

        // Handle object signing
        console.log('Sign object', object);
    }


    _createElement(nObject) {
        const editorContainer = document.createElement('div');
        editorContainer.classList.add('editor-container');

        this.contentEditor = document.createElement('textarea');
        this.contentEditor.id = 'content-editor';
        this.contentEditor.value = nObject.content || '';
        editorContainer.appendChild(this.contentEditor);

        return editorContainer;
    }
}
