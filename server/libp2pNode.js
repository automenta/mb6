import {createLibp2p} from 'libp2p';
import {webSockets} from '@libp2p/websockets';
import {webRTCStar} from '@libp2p/webrtc-star';
import * as filters from '@libp2p/websockets/filters';
import {noise} from '@libp2p/noise';
import {mplex} from '@libp2p/mplex'; //TODO mplex is deprecated; use 'yamux' instead
import {bootstrap} from '@libp2p/bootstrap';

export const createNode = async (peerId, bootstraps) => {
    const node = await createLibp2p({
        peerId,
        addresses: {listen: ['/ip4/0.0.0.0/tcp/0/ws', '/ip4/0.0.0.0/tcp/0/wss/p2p-webrtc-star']},
        transports: [webSockets({filter: filters.all}), webRTCStar()],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()],
        peerDiscovery: [bootstrap({list: bootstraps})]
    });
    await node.start();
    return node;
};
