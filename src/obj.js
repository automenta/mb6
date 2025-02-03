import {nanoid} from 'nanoid';

/**
 * Represents a shared object in the Collaborative Reality Editor.
 * NObjects can be either indefinite (representing a desired state or query) or definite (representing a real object).
 * They can be tagged with semantic types for matching and organization.
 */
class NObject {
    constructor(id, name, content) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.indefiniteProperties = {}; // Properties defining search criteria/queries
        this.definiteProperties = {};   // Properties describing actual object characteristics
        this.tags = []; // Semantic tags for matching and organization
    }

    /**
     * Adds a tag to the NObject.
     * @param {string} tag - The semantic tag to add.
     */
    addTag(tag) {
        this.tags.push(tag);
        // TODO: Implement tag validation and hypersliced semantics
        // TODO: Implement hypersliced tag semantics for complex queries and matching
        // TODO: Implement semantic matching logic based on tags and properties
    }

    /**
     * Sets a property of the NObject.
     * @param {string} key - The property key.
     * @param {*} value - The property value.
     */
    setProperty(key, value) {
        if (this.indefinite(value)) {
            this.indefiniteProperties[key] = value;
            // TODO: Update persistent queries based on changes in indefinite properties
        } else {
            this.definiteProperties[key] = value;
            // TODO: Implement semantic matching logic when definite properties are set
        }
        // TODO: Implement property-specific logic (e.g., semantic matching, query updates) based on context
        // TODO: Implement semantic matching logic based on properties
        // TODO: Update persistent queries if indefinite properties are modified
    }

    /** is the value indefinite */
    indefinite(value) {
        // TODO: Implement logic to determine if a value is indefinite or definite
        return false;
    }

    /**
     * Merges this NObject with another NObject.
     * @param {NObject} other - The NObject to merge with.
     * @returns {NObject} - A new NObject representing the merged data.
     */
    merge(other) {
        // TODO: Implement data merging logic, preserving lineage
        const merged = new NObject(nanoid(), `Merged ${this.name} and ${other.name}`, '');
        merged.indefiniteProperties = {...this.indefiniteProperties, ...other.indefiniteProperties};
        merged.definiteProperties = {...this.definiteProperties, ...other.definiteProperties};
        merged.tags = [...this.tags, ...other.tags];
        return merged;
    }
}

export default NObject;