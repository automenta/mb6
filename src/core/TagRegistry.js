import { Y } from '@yjs/yjs';
import Vector from './Vector';

export default class TagRegistry {
  static schemas = new Map();
  static vectorCache = new Map();
  static config = {
    matchThreshold: 0.7,
    semanticWeight: 0.4
  };

  static registerSchema(tagName, schema) {
    this.schemas.set(tagName, schema);
    this.vectorCache.delete(tagName); // Invalidate cache
  }

  static getSchema(tagName) {
    return this.schemas.get(tagName);
  }

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

  static semanticSimilarity(vecA, vecB) {
    const dotProduct = vecA.dot(vecB);
    const magnitudeA = vecA.magnitude();
    const magnitudeB = vecB.magnitude();
    return magnitudeA > 0 && magnitudeB > 0 
      ? dotProduct / (magnitudeA * magnitudeB)
      : 0;
  }

  static createInterfaceMatcher(interfaceDef) {
    return (source, candidate) => {
      // Implementation would use interfaceDef constraints
      // and candidate's definite properties
      let score = 0;
      // TODO: Implement actual hypersliced interface matching
      return Math.min(1, score);
    };
  }

  static getVectorEmbedding(tagName) {
    if (!this.vectorCache.has(tagName)) {
      const schema = this.getSchema(tagName);
      const baseVector = new Vector(schema?.hyperslices?.vectorWeights || {});
      this.vectorCache.set(tagName, baseVector.normalize());
    }
    return this.vectorCache.get(tagName);
  }

  static async loadSchemasFromFS() {
    // TODO: Implement filesystem schema loading
  }
}