import Level from 'level';
import { createEd25519PeerId, createFromJSON } from '@libp2p/peer-id-factory';

const db = new Level('nobject-editor-leveldb', { valueEncoding: 'json' });

export const getOrCreatePeerId = async () => {
    const peerIdJson = await db.get('peerId').catch(() => null);

    if (peerIdJson) {
        console.log(`Using existing Peer ID from LevelDB: ${JSON.stringify(peerIdJson)}`);
        return createFromJSON(peerIdJson);
    }

    console.log('Creating and storing new Peer ID in LevelDB...');
    const newPeerId = await createEd25519PeerId();
    await db.put('peerId', newPeerId.toJSON());
    console.log(`Peer ID: ${JSON.stringify(newPeerId.toJSON())}`);

    return newPeerId;
};