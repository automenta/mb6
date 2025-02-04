import NObjectFactory from '../core/NObjectFactory.js';
import { UIManager } from './UIManager.js';
import NObject from '../core/NObject.js';
import * as Y from 'yjs';
import DB from '../core/DB.js';


export default class Editor {
    constructor({ object, pluginManager, objects }) {
        this.object = object;

        this.pluginManager = pluginManager;
        this.objects = objects;

        this.el = this._createElement(object);


        this.ydoc = new Y.Doc();
        this.ytext = this.ydoc.getText('content');
        this.ytext.insert(0, this.object.content ?? '');


        this.ytext.observe(() => {
            this.object.content = this.ytext.toString();
            DB.updateObject(this.object).then(() => {

                this.pluginManager?.emit('objectUpdated', this.object);
            });
        });


        this.contentEditor.addEventListener('input', () => {

            this.ytext.insert(0, this.contentEditor.value);

        });


    }

    _createElement(nObject) {
        const editorContainer = document.createElement('div');
        editorContainer.classList.add('editor-container');

        this.contentEditor = document.createElement('textarea'); // Assign to this.contentEditor
        this.contentEditor.value = nObject.content || '';

        editorContainer.appendChild(this.contentEditor); // Append this.contentEditor

        return editorContainer;
    }


    static createEditor({ object, pluginManager, objects }) {
        return new Editor({
            object,
            pluginManager,
            objects
        });
    }
}
