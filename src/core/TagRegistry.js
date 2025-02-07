/**
 * Registry for managing semantic tags and their associated schemas and vectors.
 */
export default class TagRegistry {
    static schemas = new Map();
    static vectorCache = new Map();
    static config = {
        matchThreshold: 0.7,
        semanticWeight: 0.4
    };

    /**
     * Registers a schema for a given tag name.
     * @param {string} tagName - The name of the tag.
     * @param {object} schema - The schema for the tag.
     */
    static registerSchema(tagName, schema) {
        this.schemas.set(tagName, schema);
        this.vectorCache.delete(tagName); // Invalidate cache
    }

    /**
     * Retrieves the schema for a given tag name.
     * @param {string} tagName - The name of the tag.
     * @returns {object} The schema for the tag, or undefined if not found.
     */
    static getSchema(tagName) {
        return this.schemas.get(tagName);
    }
    static suggestTags(content) {
        const keywords = content.toLowerCase().split(/\s+/);
        const suggestedTags = [];
        for (const [tagName, schema] of TagRegistry.schemas) {
            if (keywords.some(keyword => tagName.toLowerCase().includes(keyword))) {
                suggestedTags.push(tagName);
            }
        }
        return suggestedTags;
    }


    /**
     * Gets the hypersliced relationships for a given array of tags.
     * @param {string[]} tags - The array of tags.
     * @returns {object} An object containing the hypersliced relationships.
     */
    static getHyperslicedRelationships(tags) {
        return tags.reduce((acc, tag) => {
            const schema = this.getSchema(tag);
            if (schema?.hyperslices?.interface) {
                schema.hyperslices.interface.forEach(iface => {
                    acc[iface.name] = {
                        weights: iface.vectorWeights || {},
                        matcher: this.createInterfaceMatcher(iface)
                    };
                });
            }
            return acc;
        }, {});
    }

    /**
     * Calculates the semantic similarity between two vectors.
     * @param vecA - The first vector.
     * @param vecB - The second vector.
     * @returns {number} The semantic similarity between the two vectors.
     */
    static semanticSimilarity(vecA, vecB) {
        const dotProduct = vecA.dot(vecB);
        const magnitudeA = vecA.magnitude();
        const magnitudeB = vecB.magnitude();
        return magnitudeA > 0 && magnitudeB > 0
            ? dotProduct / (magnitudeA * magnitudeB)
            : 0;
    }

    /**
     * Creates an interface matcher function for a given interface definition.
     * @param {object} interfaceDef - The interface definition.
     * @returns {function} The interface matcher function.
     */
    static createInterfaceMatcher(interfaceDef) {
        return (source, candidate) => {
            // Implementation would use interfaceDef constraints
            // and candidate's definite properties
            let score = 0;
            // TODO: Implement actual hypersliced interface matching
            return Math.min(1, score);
        };
    }
     static createInterfaceMatcher(interfaceDef) {
        return (source, candidate) => {
            let score = 0;
            for (const {name, type} of interfaceDef) {
                if (candidate.definiteTags[name] !== undefined && typeof candidate.definiteTags[name] === type) {
                    score++;
                }
            }
            return Math.min(1, score / interfaceDef.length);
        };
    }

    /**
     * Gets the vector embedding for a given tag name.
     * @param {string} tagName - The name of the tag.
     * @returns The vector embedding for the tag.
     */

    /*static getVectorEmbedding(tagName) {
        if (!this.vectorCache.has(tagName)) {
            const schema = this.getSchema(tagName);
            const baseVector = new Vector(schema?.hyperslices?.vectorWeights || {});
            this.vectorCache.set(tagName, baseVector.normalize());
        }
        return this.vectorCache.get(tagName);
    }*/

    /**
     * Loads schemas from the filesystem.
     */
    static async loadSchemasFromFS() {
        // TODO: Implement filesystem schema loading
    }
}