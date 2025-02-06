import {WebrtcProvider} from 'y-webrtc';
import * as Y from 'yjs';
import DB from '../core/DB.js';
import EditorContent from './Editor.Content.js';
import EditorToolbar from './Editor.Toolbar.js';
import AwarenessManager from './AwarenessManager.js';
import TagSelector from './TagSelector.js';
import MetadataManager from './MetadataManager.js';

let webrtcProviderInstance = null;

export default class Editor {
    constructor({object, pluginManager, emitter}) {
        this.object = object;
        this.pluginManager = pluginManager;
        this.emitter = emitter;

        this.el = this._createElement(object);

        this.toolbar = new EditorToolbar({});
        this.metadata = new MetadataManager(false); // Placeholder for isReadOnly
        this.tagSelector = new TagSelector(this.el, '');

        // Initialize Yjs doc
        this.ydoc = new Y.Doc();
        this.ytext = this.ydoc.getText('content') || new Y.Text(object.content);

        this.editorContent = new EditorContent(this.ytext, this.object, null, this.pluginManager, this.emitter);

        // Initialize WebrtcProvider as a singleton
        if (!webrtcProviderInstance) {
            webrtcProviderInstance = new WebrtcProvider(
                'nobject-editor-room', // room name
                this.ydoc,
                {
                    signaling: [
                        //'wss://signaling.yjs.dev',
                        //'ws://localhost:4444'
                    ]
                }
            );
        }
        this.webrtcProvider = webrtcProviderInstance;

        this.webrtcProvider.on('synced', () => {
            console.log('WebRTCProvider synced');
        });

        this.webrtcProvider.on('peers', peers => {
            console.log('Current peers:', peers);
        });

        this.awarenessManager = new AwarenessManager(
            this.webrtcProvider.awareness, this.editorContent.contentEditor);

        this.savedIndicator = document.createElement('span');
        this.savedIndicator.textContent = 'Saved';
        this.savedIndicator.className = 'saved-indicator';
        this.savedIndicator.textContent = 'Saved'; // Set initial state to 'Saved'

        const header = document.createElement('div');
        header.classList.add('editor-header');
        header.appendChild(this.metadata.createMetadataPanel(this.object));
        header.appendChild(this.toolbar.el);

        this.el.prepend(header);
        this.el.appendChild(this.editorContent.contentEditor)
        this.el.appendChild(this.savedIndicator);

        const CHANGED = () => this.saveCurrentObject();
        this.metadata.nameInput.addEventListener('input', CHANGED);
        this.editorContent.contentEditor.addEventListener('input', CHANGED);
    }


    _createElement(nObject) {
        const editorContainer = document.createElement('div');
        editorContainer.classList.add('editor-container');

        return editorContainer;
    }


    saveCurrentObject = () => {
        this.object.name = this.metadata.nameInput.value;
        this.object.content = this.editorContent.contentEditor.innerHTML;
        this.object.tags = this.tagSelector.getTags();
        DB.updateObject(this.object);
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

    getContentEditor() {
        return this.contentEditor;
    }

    applyFormat(command, value = undefined) {
        document.execCommand(command, false, value);
    }
}
