import {createInput} from './utils.js';

export default class Editor {
    const
    const
    const
    privacyLabel = document.createElement('label');
    privacyLabel
    textContent = 'Private';
    privacyLabel
    const
    const
    queryLabel = document.createElement('label');
    queryLabel
.
    textContent = 'Persistent Query';
    queryLabel
.
    const
    signButton = document.createElement('button');
    signButton
    textContent = 'Sign NObject';
    signButton
    'click'
.
    this
    onSign
.
    this
    object
    this
    pluginManager
.
    'objectSigned'
    this
.
    object
    titleInput = createInput('text', this.object.name, value => {
        this.object.name = value;
        this.onUpdate?.(this.object);
        this.pluginManager?.emit('objectUpdated', this.object);
    });
, () => {
    privacyToggle = createInput('checkbox', this.object.isPrivate ?? false, checked => {
        this.object.isPrivate = checked;
        this.onUpdate?.(this.object);
        this.pluginManager?.emit('objectUpdated', this.object);
    });
.
    queryToggle = createInput('checkbox', this.object.isQuery ?? false, checked => {
        this.object.isQuery = checked;
        this.onUpdate?.(this.object);
        this.pluginManager?.emit('objectUpdated', this.object);
    });
?.(

    constructor({object, onUpdate, onInsertSemantic, onSign, pluginManager}) {
        this.object = object;
        this.onUpdate = onUpdate;
        this.onInsertSemantic = onInsertSemantic;
        this.onSign = onSign;
        this.pluginManager = pluginManager;
        this.el = document.createElement('div');
        this.buildEditor();
        this.pluginManager?.emit('editorOpened', this.object);
    }
.

    /**
     * Adds a property to the current NObject.
     * @param {string} key - The property key.
     * @param {*} value - The property value.
     */
    addProperty(key, value) {
        this.object.setProperty(key, value);
        this.onUpdate?.(this.object);
        this.pluginManager?.emit('propertyChanged', {object: this.object, key, value});
    }
)
    ;

    /**
     * Adds a tag to the current NObject.
     * @param {string} tag - The tag to add.
     */
    addTag(tag) {
        this.object.addTag(tag);
        this.onUpdate?.(this.object);
    }
.

    buildEditor() {
        const titleInput = createInput('text', this.object.name, value => {
            this.object.name = value;
            this.onUpdate?.(this.object);
            this.pluginManager?.emit('objectUpdated', this.object);
        });
        const privacyToggle = createInput('checkbox', this.object.isPrivate ?? false, checked => {
            this.object.isPrivate = checked;
            this.onUpdate?.(this.object);
            this.pluginManager?.emit('objectUpdated', this.object);
        });
        const privacyLabel = document.createElement('label');
        privacyLabel.textContent = 'Private';
        privacyLabel.appendChild(privacyToggle);

        const queryToggle = createInput('checkbox', this.object.isQuery ?? false, checked => {
            this.object.isQuery = checked;
            this.onUpdate?.(this.object);
            this.pluginManager?.emit('objectUpdated', this.object);
        });


    };
?.

    appendChild(privacyToggle);

    appendChild(queryToggle);
,

    addEventListener(
.

    emit(
)
    ;
}
)
;

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
        this.pluginManager?.emit('semanticInserted', {object: this.object, type: insertMenu.value});
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
    this.onUpdate?.(this.object);
    this.pluginManager?.emit('objectUpdated', this.object);
});
editorContainer.appendChild(contentEditor);

const propsContainer = document.createElement('div');
propsContainer.className = 'properties-container';

const renderProperties = () => {
    propsContainer.innerHTML = '';

    const addPropBtn = document.createElement('button');
    addPropBtn.textContent = 'Add Property';
    addPropBtn.addEventListener('click', () => {
        const keyInput = createInput('text', '', key => {
            const valueInput = createInput('text', '', value => {
                this.addProperty(key, value);
                renderProperties();
            });
            propsContainer.appendChild(valueInput);
        });
        propsContainer.appendChild(keyInput);
    });
    propsContainer.appendChild(addPropBtn);

    for (const key in this.object.indefiniteProperties) {
        const value = this.object.indefiniteProperties[key];
        const propLabel = document.createElement('label');
        propLabel.textContent = `${key} (indefinite)`;
        const propInput = createInput('text', value, newValue => {
            this.object.setProperty(key, newValue);
            this.onUpdate?.(this.object);
            this.pluginManager?.emit('propertyChanged', {object: this.object, key, value: newValue});
        });
        propLabel.appendChild(propInput);
        propsContainer.appendChild(propLabel);
    }

    for (const key in this.object.definiteProperties) {
        const value = this.object.definiteProperties[key];
        const propLabel = document.createElement('label');
        propLabel.textContent = `${key} (definite)`;
        const propInput = createInput('text', value, newValue => {
            this.object.setProperty(key, newValue);
            this.onUpdate?.(this.object);
            this.pluginManager?.emit('propertyChanged', {object: this.object, key, value: newValue});
        });
        propLabel.appendChild(propInput);
        propsContainer.appendChild(propLabel);
    }
};

renderProperties();
this.el.append(titleInput, privacyLabel, queryLabel, signButton, insertMenu, editorContainer, propsContainer);

// TODO: Add UI elements for adding tags
// Suggestion: Use a tag input component with autocomplete based on available tags
// Example:
// const tagsContainer = document.createElement('div');
// const tagInput = document.createElement('input');
// tagInput.type = 'text';
// tagInput.placeholder = 'Add tag...';
// tagInput.addEventListener('change', () => {
//     this.addTag(tagInput.value);
//     tagInput.value = '';
// Add tag input
const tagsContainer = document.createElement('div');
const tagInput = document.createElement('input');
tagInput.type = 'text';
tagInput.placeholder = 'Add tag...';
tagsContainer.appendChild(tagInput);
const tagInput = this.createTagInput([], tag => {
    this.addTag(tag);
    renderProperties(); // Re-render properties to update tag list
});
tagsContainer.appendChild(tagInput);
this.el.appendChild(tagsContainer);
// });
// tagsContainer.appendChild(tagInput);
// this.el.appendChild(tagsContainer);

}
}