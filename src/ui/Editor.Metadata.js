import { createInput } from './UIUtil.js';
import DB from '../core/DB.js';


export default class EditorMetadata {
    constructor({ object, onUpdate, pluginManager }) {
        this.object = object;
        this.onUpdate = onUpdate;
        this.pluginManager = pluginManager;
        this.el = document.createElement('div');
        this.el.className = 'metadata-editor';

        this.renderTags();
    }

    addTag(key, value) {
        this.object.addTag(key, value);
        this.updateObject();
    }

    updateObject() {
        return DB.updateObject(this.object).then(() => {
            this.onUpdate?.(this.object);
            this.pluginManager?.emit('objectUpdated', this.object);
            this.renderTags();
        });
    }

    createTagInput(key, value, type = 'text') {
        const tagLabel = document.createElement('label');
        tagLabel.textContent = `${key} (${type})`;
        const tagInput = createInput('text', value, newValue => {
            this.object.addTag(key, newValue); // Use addTag for updates as well
            this.updateObject();
            this.pluginManager?.emit('tagChanged', { object: this.object, key, value: newValue }); // Emit 'tagChanged' event
        });
        tagLabel.appendChild(tagInput);
        return tagLabel;
    }


    renderTags() {
        this.el.innerHTML = '';

        const addTagBtn = document.createElement('button');
        addTagBtn.textContent = 'Add Tag';
        addTagBtn.addEventListener('click', () => {
            const keyInput = createInput('text', '', key => {
                const valueInput = createInput('text', '', value => {
                    this.addTag(key, value);
                });
                this.el.appendChild(valueInput);
            });
            this.el.appendChild(keyInput);
        });
        this.el.appendChild(addTagBtn);


        // Combine indefinite and definite properties into tags
        const allTags = { ...this.object.indefiniteProperties, ...this.object.definiteProperties };

        Object.entries(allTags).map(([key, value]) => this.createTagInput(key, value))
            .forEach(tagInput => this.el.appendChild(tagInput));
    }


    get element() {
        return this.el;
    }
}