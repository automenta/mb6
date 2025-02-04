import TagSelector from './TagSelector.js';

class UIBuilder {
    constructor(isReadOnly, tags) {
        this.isReadOnly = isReadOnly;
        this.tags = tags;
    }

    createEditorContainer() {
        const editorContainer = this.createElement('div', 'editor-container');
        editorContainer.append(
            this.createTitleEditor(),
            this.createContentEditor(),
            this.createMetadataPanel(),
            this.createTagSelectorContainer()
        );
        return editorContainer;
    }

    createTagFormElement(tagName) {
        let schema;
        try {
            const fs = require('fs');
            const schemaPath = `/home/me/mb6/tag/${tagName}.json`; // Construct path to schema file
            const schemaContent = fs.readFileSync(schemaPath, 'utf8');
            schema = JSON.parse(schemaContent);
        } catch (error) {
            console.error(`Failed to load schema for tag '${tagName}': ${error}`);
            return null;
        }

        const formElement = this.createElement('div', 'tag-element');
        formElement.dataset.schemaName = tagName;

        if (this.isReadOnly) {
            formElement.classList.add('read-only');
        }

        // Add a button to remove the tag element
        const removeButton = this.createElement('button', 'remove-tag-element');
        removeButton.textContent = 'x';
        removeButton.addEventListener('click', () => formElement.remove());
        formElement.append(removeButton);

        // Add form fields based on schema properties
        if (schema.properties) {
            for (const propName in schema.properties) {
                const property = schema.properties[propName];
                const label = this.createElement('label');
                label.textContent = property.title || propName;
                label.setAttribute('for', `${propName}-field`);

                let inputElement;

                switch (property.type) {
                    case 'string':
                        inputElement = property.format === 'textarea' ? this.createElement('textarea', null, `${propName}-field`) : this.createElement('input', null, `${propName}-field`);
                        inputElement.type = 'text';
                        break;
                    case 'number':
                        inputElement = this.createElement('input', null, `${propName}-field`);
                        inputElement.type = 'number';
                        break;
                    case 'boolean':
                        inputElement = this.createElement('input', null, `${propName}-field`);
                        inputElement.type = 'checkbox';
                        break;
                    case 'array':
                        if (property.items && property.items.type === 'string' && property.items.enum) { // Added check for property.items existence
                            inputElement = this.createElement('select', null, `${propName}-field`);
                            property.items.enum.forEach((option) => {
                                const optionElement = this.createElement('option');
                                optionElement.value = option;
                                optionElement.text = option;
                                inputElement.add(optionElement);
                            });
                        }
                        break;
                    default:
                        inputElement = this.createElement('input', null, `${propName}-field`);
                        inputElement.type = 'text';
                        console.warn(`Unsupported tag property type: ${property.type}`);
                }

                inputElement.dataset.schemaProperty = propName;
                if (this.isReadOnly) {
                    inputElement.disabled = true;
                }

                formElement.append(label, inputElement);
            }
        }

        return formElement;
    }

    createElement(tagName, className, content) {
        const element = document.createElement(tagName);
        element.className = className;
        if (content) {
            element.textContent = content;
        }
        return element;
    }

    createTitleEditor() {
        const titleEditor = this.createElement('input', 'document-title');
        titleEditor.type = 'text';
        return titleEditor;
    }

    createContentEditor() {
        const contentEditor = this.createElement('div', 'content-editor');
        contentEditor.contentEditable = this.isReadOnly ? 'false' : 'true';
        return contentEditor;
    }

    createMetadataPanel() {
        return this.createElement('div', 'metadata-panel', 'Metadata Panel');
    }

    createTagSelectorContainer() {
        const tagSelectorContainer = this.createElement('div', 'tag-selector-container');
        const s = new TagSelector(tagSelectorContainer, 'page'); // Assuming TagSelector is defined elsewhere
        //s.addTag('Common Tags', 'page'); // Add 'page' tag
        //s.addTag('Common Tags', 'BlogPost'); // Add 'BlogPost' tag
        return tagSelectorContainer;
    }
}

export default UIBuilder;