// TODO: Implement routing architecture with pluggable prioritization and filter heuristics (README.md line 95)
import express from 'express';
// TODO: Implement connections to IPFS and BitTorrent (README.md line 92)
import {createServer} from 'http';
// TODO: Implement WebSocket connection for UI client and additional functionality (README.md line 97)
import {Server} from 'socket.io';
// TODO: Implement plugins for input (screenshots, etc.) and analysis (OCR, etc.) (README.md line 98)
import * as Y from 'yjs';
import {LeveldbPersistence} from 'y-leveldb';
import path from 'path';
import {createNode} from './libp2pNode.js';
import {ServerPlugins} from './ServerPlugins.js';
import Level from "level";
import {createEd25519PeerId, createFromJSON} from "@libp2p/peer-id-factory";

const pluginManager = new ServerPlugins();

const db = new Level('nobject-editor-leveldb', {valueEncoding: 'json'});

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


const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_, res) => res.sendFile(path.resolve('dist/index.html')));
}

/**
 * TODO follow this official example:
 *
 * import * as Y from 'yjs'
 * import { LeveldbPersistence } from 'y-leveldb'
 *
 * const persistence = new LeveldbPersistence('./storage-location')
 *
 * const ydoc = new Y.Doc()
 * ydoc.getArray('arr').insert(0, [1, 2, 3])
 * ydoc.getArray('arr').toArray() // => [1, 2, 3]
 *
 * // store document updates retrieved from other clients
 * persistence.storeUpdate('my-doc', Y.encodeStateAsUpdate(ydoc))
 *
 * // when you want to sync, or store data to a database,
 * // retrieve the temporary Y.Doc to consume data
 * const ydocPersisted = await persistence.getYDoc('my-doc')
 * ydocPersisted.getArray('arr') // [1, 2, 3]
 */
const server = createServer(app);
const io = new Server(server, {cors: {origin: '*', methods: ['GET', 'POST']}});

(async () => {
    const ydoc = new Y.Doc();
    await new LeveldbPersistence('./nobject-editor-leveldb');//.bindState('nobject-editor', ydoc);
    console.log('Y.Doc bound to LevelDB persistence');

    const peerId = await getOrCreatePeerId();
    const node = await createNode(peerId, [
        '/ip4/127.0.0.1/tcp/4001/ws/p2p/QmTFUXxRoKJgWkCyxs8hX5jCBrHzs67zGtffxLEpWq9p5P',
        '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3ER6ao5'
    ]);
    console.log(`libp2p node started with id: ${node.peerId.toString()}`);

    node.addEventListener('peer:discovery', ({detail}) => {
        console.log('Discovered', detail.id?.toString());
        pluginManager.emit('onPeerDiscovery', detail.id);
    });
    node.addEventListener('peer:connect', ({detail}) => {
        console.log('Connected to', detail.remotePeer?.toString());
        pluginManager.emit('onPeerConnect', detail.remotePeer);
    });
    node.addEventListener('peer:disconnect', ({detail}) => {
        console.log('Disconnected from', detail.remotePeer?.toString());
        pluginManager.emit('onPeerDisconnect', detail.remotePeer);
    });

    io.on('connection', socket => {
        console.log('A user connected');
        pluginManager.emit('onConnection', socket);
        socket.on('disconnect', () => {
            console.log('User disconnected');
            pluginManager.emit('onDisconnect', socket);
        });
        socket.on('update', update => {
            pluginManager.emit('onBeforeUpdate', update);
            Y.applyUpdate(ydoc, new Uint8Array(update));
            socket.broadcast.emit('update', update);
            pluginManager.emit('onAfterUpdate', update);
        });
        ydoc.on('update', update => socket.emit('update', Array.from(update)));
    });

    const port = process.env.NODE_ENV === 'production'
        ? (process.env.PORT ?? 3000)
        : (process.env.PORT ?? 3001);
    server.listen(port, () => console.log(`Server running on port ${port}`));
})();
        