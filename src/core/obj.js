import {nanoid} from 'nanoid';

/**
 * Represents a shared object in the Collaborative Reality Editor.
 * NObjects can be either indefinite (representing a desired state or query) or definite (representing a real object).
 * They can be tagged with semantic types for matching and organization.
 */
class NObject {
    id;
    name;
    content;
    properties;
    tags;

    constructor(id, name, content, properties = {}, tags = []) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.properties = properties;
        this.tags = tags;
    }

    get indefiniteProperties() {
        return Object.fromEntries(Object.entries(this.properties).filter(([, value]) => this.isIndefinite(value)));
    }

    get definiteProperties() {
        return Object.fromEntries(Object.entries(this.properties).filter(([, value]) => !this.isIndefinite(value)));
    }

    /**
     * Adds a tag to the NObject.
     * @param {string} tag - The semantic tag to add.
     */
    addTag(tag) {
        this.tags.push(tag);
    }

    /**
     * Checks if a value is indefinite.
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is indefinite, false otherwise.
     */
    isIndefinite(value) {
        return typeof value === 'object' && value !== null && value.__indefinite === true;
    }

    /**
     * Merges this NObject with another NObject.
     * @param {NObject} other - The NObject to merge with.
     * @returns {NObject} - A new NObject representing the merged data.
     */
    merge(other) {
        const mergedProperties = {...this.properties, ...other.properties};
        const mergedTags = [...this.tags, ...other.tags];
        let mergedContent = this.content;
        if (this.getContentType() === other.getContentType()) {
            switch (this.getContentType()) {
                case 'text':
                    mergedContent = `${this.content}
${other.content}`;
                    break;
                case 'json':
                    mergedContent = {...this.content, ...other.content};
                    break;
                // Add more content type specific merging logic here as needed
            }
        }
        return new NObject(nanoid(), `Merged ${this.name} and ${other.name}`, mergedContent, mergedProperties, mergedTags);
    }
}

export default NObject;