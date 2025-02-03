import {describe, expect, it} from 'vitest';
import * as Y from 'yjs';

describe('Yjs Document', () => {
    it('initializes a Y.Doc and updates a map correctly', () => {
        const doc = new Y.Doc();
        const map = doc.getMap('test');
        map.set('key', 'value');
        expect(map.get('key')).toBe('value');
    });
    it('encodes state as update and returns a Uint8Array', () => {
        const doc = new Y.Doc();
        expect(Y.encodeStateAsUpdate(doc)).toBeInstanceOf(Uint8Array);
    });
});
        