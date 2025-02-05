import * as Y from 'yjs';
import DB from '../core/DB.js';
import EditorToolbar from './Editor.Toolbar.js';
//import EditorMetadata from './Editor.Metadata.js';
import AwarenessManager from './AwarenessManager.js';
import TagSelector from './TagSelector.js';
import MetadataManager from './MetadataManager.js';
import {Awareness} from 'y-protocols/awareness';

export default class Editor {
    constructor({ object, pluginManager, objects, emitter, config = { db: DB } }) {
        this.config = config;
        this.object = object;
        
        // Initialize Yjs document layer
        const ydoc = new Y.Doc();
        const doc = ydoc.get('content');
        this.ydoc = doc;

        // Set up Y.js streams for real-time updates
        this.streams = new Y.Streams(doc);
        this.streams.on('update', () => {
            this.updateContent();
        });

        this.el = this._createElement(object);
        this.pluginManager = pluginManager;
        this.objects = objects;
        this.emitter = emitter;

        this.toolbar = new EditorToolbar({});
        this.metadata = new MetadataManager(false); // Placeholder for isReadOnly
        this.tagSelector = new TagSelector(this.el, '');
        this.awarenessManager = new AwarenessManager(new Awareness(ydoc), this.contentEditor);

        this.ytext = this.ydoc.getText('content');
        this.savedIndicator = document.createElement('span');
        this.savedIndicator.textContent = 'Saved';
        this.savedIndicator.className = 'saved-indicator';

        // Create a container for the metadata and toolbar
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('editor-header');
        headerContainer.appendChild(this.metadata.createMetadataPanel(this.object));
        headerContainer.appendChild(this.toolbar.el);

        this.el.prepend(headerContainer);
        this.el.appendChild(this.savedIndicator);

        this.ytext.insert(0, this.object.content ?? '');
        this.contentEditor.innerHTML = this.ytext.toString(); // Use innerHTML for div

        this.contentEditor.addEventListener('input', () => {
            this.ytext.delete(0, this.ytext.length);
            this.ytext.insert(0, this.contentEditor.innerHTML);
            this.saveCurrentObject();
        });


        this.ytext.observe(async () => {
            if (this.object.content !== this.ytext.toString()) {
                this.savedIndicator.textContent = 'Saving...';
                this.object.content = this.ytext.toString();
                await DB.updateObject(this.object);
                this.emitter.emit('objectUpdated');
                this.saveCurrentObject(); // Call saveCurrentObject here as well
                this.savedIndicator.textContent = 'Saved';
            }
        });

        this.savedIndicator.textContent = 'Saved'; // Set initial state to 'Saved'
    }


    _createElement(nObject) {
        const editorContainer = document.createElement('div');
        editorContainer.classList.add('editor-container');

        // Create Yjs content element
        this.contentEditor = document.createElement('yjs-content-element');
        this.contentEditor.id = 'content-editor';
        this.contentEditor.style.contentEditable = true;
        editorContainer.appendChild(this.contentEditor);

        return editorContainer;
    }


    saveCurrentObject() {
        if (this.object) {
            this.object.content = this.contentEditor.innerHTML;
            this.object.tags = this.tagSelector.getTags();
            if (this.config && this.config.db) {
                DB.updateObject(this.object);
            }
        }
    }


    onUpdate(callback) {
        this.ytext.observe(callback);
    }


    formatText(format, value) {
        document.execCommand(format, false, value);
    }


    setBlockFormat(format) {
        switch (format) {
            case 'heading':
                document.execCommand('formatBlock', false, '<h1>');
                break;
            case 'pre':
                document.execCommand('formatBlock', false, '<pre>');
                break;
            case 'ordered-list':
                document.execCommand('insertOrderedList', false);
                break;
            case 'bulleted-list':
                document.execCommand('insertUnorderedList', false);
                break;
            case 'blockquote':
                document.execCommand('formatBlock', false, '<blockquote>');
                break;
            default:
                document.execCommand('formatBlock', false, format);
                break;
        }
    }


    applyFormat(command, value = undefined) {
        document.execCommand(command, false, value);
    }
}
