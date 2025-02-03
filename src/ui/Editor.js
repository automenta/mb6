import { createInput } from './utils.js';

export default class Editor {
    constructor({ object, onUpdate, onInsertSemantic, onSign, pluginManager }) {
        this.object = object;
        this.onUpdate = onUpdate;
        this.onInsertSemantic = onInsertSemantic;
        this.onSign = onSign;
        this.pluginManager = pluginManager;
        this.el = document.createElement('div');
        this.buildEditor();
        this.pluginManager?.emit('editorOpened', this.object);
    }

    addProperty(key, value) {
        this.object.setProperty(key, value);
        this.updateObject();
    }

    addTag(tag) {
        this.object.addTag(tag);
        this.updateObject();
    }

    updateObject() {
        this.onUpdate?.(this.object);
        this.pluginManager?.emit('objectUpdated', this.object);
        this.renderProperties(); // Re-render properties after update
    }


    createPropertyInput(key, value, type = 'text') {
        const propLabel = document.createElement('label');
        propLabel.textContent = `${key} (${type})`;
        const propInput = createInput('text', value, newValue => {
            this.object.setProperty(key, newValue);
            this.updateObject();
            this.pluginManager?.emit('propertyChanged', { object: this.object, key, value: newValue });
        });
        propLabel.appendChild(propInput);
        return propLabel;
    }

    buildEditor() {
        const titleInput = createInput('text', this.object.name, value => {
            this.object.name = value;
            this.updateObject();
        });

        const privacyToggle = createInput('checkbox', this.object.isPrivate ?? false, checked => {
            this.object.isPrivate = checked;
            this.updateObject();
        });
        const privacyLabel = document.createElement('label');
        privacyLabel.textContent = 'Private';
        privacyLabel.appendChild(privacyToggle);

        const queryToggle = createInput('checkbox', this.object.isQuery ?? false, checked => {
            this.object.isQuery = checked;
            this.updateObject();
        });
        const queryLabel = document.createElement('label');
        queryLabel.textContent = 'Persistent Query';
        queryLabel.appendChild(queryToggle);

        const signButton = document.createElement('button');
        signButton.textContent = 'Sign NObject';
        signButton.addEventListener('click', () => this.onSign?.(this.object));

        const insertMenu = document.createElement('select');
        insertMenu.innerHTML = `
            <option value="" disabled selected>Insert semantic widget...</option>
            <option value="Person">Person Class</option>
            <option value="Place">Place Class</option>
            <option value="Date">Date Property</option>
            <option value="Price">Price Property</option>
        `;
        insertMenu.addEventListener('change', () => {
            if (insertMenu.value) {
                this.onInsertSemantic?.(this.object, insertMenu.value);
                this.pluginManager?.emit('semanticInserted', { object: this.object, type: insertMenu.value });
                insertMenu.value = '';
            }
        });

        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        const insertTagBtn = document.createElement('button');
        insertTagBtn.type = 'button';
        insertTagBtn.textContent = 'Insert Tag';
        insertTagBtn.addEventListener('click', () => window.insertTagWidget?.());
        toolbar.appendChild(insertTagBtn);

        const editorContainer = document.createElement('div');
        editorContainer.className = 'editor-container';
        editorContainer.appendChild(toolbar);

        const contentEditor = document.createElement('div');
        contentEditor.className = 'content-editor';
        contentEditor.contentEditable = 'true';
        contentEditor.innerHTML = this.object.content ?? '';
        contentEditor.addEventListener('input', () => {
            this.object.content = contentEditor.innerHTML;
            this.updateObject();
        });
        editorContainer.appendChild(contentEditor);

        const propsContainer = document.createElement('div');
        propsContainer.className = 'properties-container';

        this.renderProperties = () => {
            propsContainer.innerHTML = '';

            const addPropBtn = document.createElement('button');
            addPropBtn.textContent = 'Add Property';
            addPropBtn.addEventListener('click', () => {
                const keyInput = createInput('text', '', key => {
                    const valueInput = createInput('text', '', value => {
                        this.addProperty(key, value);
                    });
                    propsContainer.appendChild(valueInput);
                });
                propsContainer.appendChild(keyInput);
            });
            propsContainer.appendChild(addPropBtn);


            Object.entries(this.object.indefiniteProperties).forEach(([key, value]) => {
                propsContainer.appendChild(this.createPropertyInput(key, value, 'indefinite'));
            });

            Object.entries(this.object.definiteProperties).forEach(([key, value]) => {
                propsContainer.appendChild(this.createPropertyInput(key, value, 'definite'));
            });
        };

        this.renderProperties();
        this.el.append(titleInput, privacyLabel, queryLabel, signButton, insertMenu, editorContainer, propsContainer);

        const tagsContainer = document.createElement('div');
        const tagInput = createInput('text', '', tag => {
            this.addTag(tag);
        });
        tagsContainer.appendChild(tagInput);
        this.el.appendChild(tagsContainer);
    }
}