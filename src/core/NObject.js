import {nanoid} from 'nanoid';
import EventEmitter from 'events';
import * as Yjs from 'yjs';
import TagRegistry from './TagRegistry';
import NotificationQueue from './NotificationQueue';


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
    metadata;
    author;
    created;
    updated;

    constructor(id, name, content, tags, author, created, updated) {
        super();
        this.id = id;
        this.name = name;
        this.content = typeof content === 'string' ? new Yjs.Text(content) : content;
        this.tags = tags instanceof Yjs.Map ? tags : new Yjs.Map(tags);
        this.author = author;
        this.created = created || Date.now();
        this.updated = updated || Date.now();

        // Enable CRDT synchronization for tags
        this.tags.observeDeep(() => this._onChange());
        if (this.content instanceof Yjs.Text) {
            this.content.observe(() => this._onChange());
        }
    }

    get indefiniteTags() {
        return Object.fromEntries(
            Object.entries(this.tags.toJSON()).filter(([, value]) => this.isIndefinite(value))
        );
    }

    get definiteTags() {
        return Object.fromEntries(
            Object.entries(this.tags.toJSON()).filter(([, value]) => !this.isIndefinite(value))
        );
    }

    /**
     * Get all tags
     */
    get tagsList() {
        return Array.from(this.tags.keys());
    }

    addTag(tag, value = true, isIndefinite = false) {
        const key = isIndefinite ? `indef:${tag}` : tag;
        const val = isIndefinite ? {
            __indefinite: true,
            criteria: value,
            created: Date.now()
        } : value;
        this.tags.set(key, val);
        if (!isIndefinite) {
            this.tags.delete(`indef:${tag}`);
        }
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
        const mergedDoc = new Yjs.Doc();
        Yjs.applyUpdate(mergedDoc, Yjs.mergeUpdates([
            Yjs.encodeStateAsUpdate(this.content),
            Yjs.encodeStateAsUpdate(other.content)
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
        if (this.content instanceof Yjs.Text) return 'text';
        if (this.content instanceof Yjs.Map) return 'map';
        if (this.content instanceof Yjs.Array) return 'array';
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
        const tagRelationships = TagRegistry.getHyperslicedRelationships(this.tagsList);

        // Compare using hypersliced interfaces
        for (const [interfaceName, {weights, matcher}] of Object.entries(tagRelationships)) {
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

            this.resolveMatch(candidate);
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

    resolveMatch(candidate, matchedInterfaces) {
        // This method is intentionally left blank
    }
}

export default NObject;