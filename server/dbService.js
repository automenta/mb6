import Level from 'level';
import {createEd25519PeerId, createFromJSON} from '@libp2p/peer-id-factory';

const db = new Level('nobject-editor-leveldb', {valueEncoding: 'json'});

export const getOrCreatePeerId = async () => {
    try {
        const peerIdJson = await db.get('peerId');
        console.log(`Found existing Peer ID in LevelDB: ${JSON.stringify(peerIdJson)}`);
        return createFromJSON(peerIdJson);
    } catch (error) {
        if (error.code === 'LEVEL_NOT_FOUND') {
            console.log('No Peer ID found in LevelDB. Creating a new one...');
            const newPeerId = await createEd25519PeerId();
            const newPeerIdJson = newPeerId.toJSON();
            await db.put('peerId', newPeerIdJson);
            console.log(`New Peer ID created and stored in LevelDB: ${JSON.stringify(newPeerIdJson)}`);
            return newPeerId;
        }
        throw error;
    }
};
        