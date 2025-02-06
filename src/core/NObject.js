import {nanoid} from 'nanoid';
import EventEmitter from 'events';
import TagRegistry from './TagRegistry';

/**
 * Represents a shared object in the Collaborative Reality Editor.
 * NObjects can be either indefinite (representing a desired state or query) or definite (representing a real object).
 * They can be tagged with semantic types for matching and organization.
 */
class NObject extends EventEmitter {
    id;
    name;
    content;
    tags;

    constructor(id, name, content, tags = new Y.Map()) {
        this.id = id;
        this.name = name;
        this.content = typeof content === 'string' ? new Y.Text(content) : content;
        this.tags = tags instanceof Y.Map ? tags : new Y.Map(tags);
        
        // Enable CRDT synchronization for tags
        this.tags.observeDeep(() => this._onChange());
        if (this.content instanceof Y.Text) {
            this.content.observe(() => this._onChange());
        }
    }

    get indefiniteTags() {
        return Object.fromEntries(Object.entries(this.tags).filter(([, value]) => this.isIndefinite(value)));
    }

    get definiteTags() {
        return Object.fromEntries(Object.entries(this.tags).filter(([, value]) => !this.isIndefinite(value)));
    }

    /**
     * Adds a tag to the NObject (stored as property with 'tag:' prefix)
     * @param {string} tag - The semantic tag to add
     */
    addTag(tag, value = true, isIndefinite = false) {
        if (isIndefinite) {
            this.tags.set(`indef:${tag}`, {
                __indefinite: true,
                criteria: value,
                created: Date.now()
            });
        } else {
            this.tags.delete(`indef:${tag}`);
            this.tags.set(tag, value);
        }
    }

    /**
     * Get all tags
     */
    get tagsList() {
        return Array.from(this.tags.keys());
    }

    /**
     * Checks if this NObject contains any indefinite tags
     * @returns {boolean} True if any indefinite tags exist
     */
    isIndefinite() {
        return Array.from(this.tags.keys()).some(k => k.startsWith('indef:'));
    }

    /**
     * Merges this NObject with another NObject.
     * @param {NObject} other - The NObject to merge with.
     * @returns {NObject} - A new NObject representing the merged data.
     */
    merge(other) {
        // Create merged document using CRDT merge strategy
        const mergedDoc = new Y.Doc();
        Y.applyUpdate(mergedDoc, Y.mergeUpdates([
            Y.encodeStateAsUpdate(this.doc),
            Y.encodeStateAsUpdate(other.doc)
        ]));

        // Tags are now handled through properties merge
        
        // Preserve metadata from both versions
        const mergedMetadata = {
            ...this.metadata,
            ...other.metadata,
            mergedAt: new Date().toISOString(),
            parents: [
                ...(this.metadata?.parents || [this.id]),
                ...(other.metadata?.parents || [other.id])
            ]
        };

        // Create new NObject with merged state
        const merged = new NObject(
            nanoid(),
            `Merged ${this.name} and ${other.name}`,
            mergedDoc.getText('content'),
            mergedDoc.getMap('tags')
        );
        
        // Apply merged metadata
        merged.metadata = mergedMetadata;
        
        return merged;
    }
    getContentType() {
        if (this.content instanceof Y.Text) return 'text';
        if (this.content instanceof Y.Map) return 'map';
        if (this.content instanceof Y.Array) return 'array';
        return 'unknown';
    }

    /**
     * Semantic matching engine - core of persistent query system
     * @param {NObject} candidate - Definite object to match against
     * @returns {number} Match score (0-1)
     */
    matchAgainst(candidate) {
        // Only indefinite objects can perform matching
        if (!this.isIndefinite()) return 0;
        
        let score = 0;
        const totalWeights = Object.keys(this.indefiniteProperties).length;
        const tagRelationships = TagRegistry.getHyperslicedRelationships(this.tagsList);
        
        // Compare using hypersliced interfaces
        for (const [interfaceName, { weights, matcher }] of Object.entries(tagRelationships)) {
            const interfaceScore = matcher(this, candidate);
            score += interfaceScore * weights[interfaceName] || 1;
        }
        
        // Semantic vector matching
        const semanticScore = TagRegistry.semanticSimilarity(
            this.semanticVector(),
            candidate.semanticVector()
        );
        
        const finalScore = Math.min(1,
            (score * 0.6) + // Hypersliced interface matches
            (semanticScore * 0.4) // Semantic similarity
        );
        
        // Threshold-based notification with cooldown
        if (finalScore > TagRegistry.config.matchThreshold) {
            const matchData = {
                candidate,
                score: finalScore,
                matchedInterfaces: Object.keys(tagRelationships),
                timestamp: Date.now()
            };
            
            this.resolveMatch(candidate, matchedInterfaces);
            this.emit('match', matchData);
            NotificationQueue.add(matchData);
        }
        
        return finalScore;
    }

    semanticVector() {
        return this.tagsList
            .map(tag => TagRegistry.getVectorEmbedding(tag))
            .reduce((acc, vec) => acc.add(vec), new Vector());
    }

    /**
     * Validate tags against hypersliced schemas
     * @returns {Array<string>} Validation errors
     */
    validateTags() {
        const errors = [];
        for (const tag of this.tagsList) {
            const schema = TagRegistry.getSchema(tag);
            if (!schema) {
                errors.push(`Missing schema for tag: ${tag}`);
                continue;
            }
            
            try {
                schema.validate(this.definiteTags);
            } catch (e) {
                errors.push(`Tag validation failed (${tag}): ${e.message}`);
            }
        }
        return errors;
    }

    _onChange() {
        // Emit change event for synchronization
        this.emit('change', this);
        
        // Auto-validate tags on change
        const errors = this.validateTags();
        if (errors.length > 0) {
            this.emit('validation-error', errors);
        }
    }

}

export default NObject;