export default class Editor {
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

    buildEditor() {
        const createInput = (type, value, onChange) => {
            const input = document.createElement('input');
            input.type = type;
            if (type === 'checkbox') {
                input.checked = value;
                input.addEventListener('change', () => onChange(input.checked));
            } else {
                input.value = value;
                input.addEventListener('input', () => onChange(input.value));
            }
            return input;
        };

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
        const queryLabel = document.createElement('label');
        queryLabel.textContent = 'Persistent Query';
        queryLabel.appendChild(queryToggle);

        const signButton = document.createElement('button');
        signButton.textContent = 'Sign NObject';
        signButton.addEventListener('click', () => {
            this.onSign?.(this.object);
            this.pluginManager?.emit('objectSigned', this.object);
        });

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

        this.el.append(titleInput, privacyLabel, queryLabel, signButton, insertMenu, editorContainer);
    }
}
        