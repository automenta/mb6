import * as Yjs from 'yjs';
import { DOMBinding } from '@yjs/dom';

export default class EditorMetadata {
    constructor({ object, onSave }) {
        this.object = object;
        this.onSave = onSave;

        this.ydoc = new Yjs.Doc();
        this.ytextName = this.ydoc.getText('name');
        this.ytextDescription = this.ydoc.getText('description');
        this.ytextTags = this.ydoc.getText('tags');

        this.el = document.createElement('div');
        this.el.className = 'editor-metadata';

        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.className = 'name-input';
        this.nameInput.value = this.object.name ?? '';
        this.nameInput.placeholder = 'NObject Name';

        const bindingName = new DOMBinding(this.ytextName, this.nameInput);

        this.descriptionInput = document.createElement('textarea');
        this.descriptionInput.className = 'description-input';
        this.descriptionInput.value = this.object.description ?? '';
        this.descriptionInput.placeholder = 'NObject Description';

        const bindingDescription = new DOMBinding(this.ytextDescription, this.descriptionInput);

        this.tagsInput = document.createElement('input');
        this.tagsInput.type = 'text';
        this.tagsInput.className = 'tags-input';
        this.tagsInput.value = this.object.tags ?? '';
        this.tagsInput.placeholder = 'NObject Tags';

        const bindingTags = new DOMBinding(this.ytextTags, this.tagsInput);

        this.nameInput.addEventListener('input', () => {
            this.ydoc.transact(() => {
                this.ytextName.delete(0, this.ytextName.length);
                this.ytextName.insert(0, this.nameInput.value);
                this.object.name = this.nameInput.value;
            });
            this.onSave?.(this.object);
            DB.updateObject(this.object).then(() => {
                this.onSave?.(this.object);
            });
        });

        this.descriptionInput.addEventListener('input', () => {
            this.ydoc.transact(() => {
                this.ytextDescription.delete(0, this.ytextDescription.length);
                this.ytextDescription.insert(0, this.descriptionInput.value);
                this.object.description = this.descriptionInput.value;
            });
            this.onSave?.(this.object);
            DB.updateObject(this.object).then(() => {
                this.onSave?.(this.object);
            });
        });

        this.tagsInput.addEventListener('input', () => {
            this.ydoc.transact(() => {
                this.ytextTags.delete(0, this.ytextTags.length);
                this.ytextTags.insert(0, this.tagsInput.value);
                this.object.tags = this.tagsInput.value;
            });
            this.onSave?.(this.object);
            DB.updateObject(this.object).then(() => {
                this.onSave?.(this.object);
            });
        });

        this.el.appendChild(this.nameInput);
        this.el.appendChild(this.descriptionInput);
        this.el.appendChild(this.tagsInput);
    }
}