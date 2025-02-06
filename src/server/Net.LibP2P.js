import {createLibp2p} from 'libp2p';
import {webSockets} from '@libp2p/websockets';
import {webRTCStar} from '@libp2p/webrtc-star';
import * as filters from '@libp2p/websockets/filters';
import {noise} from '@libp2p/noise';
import {yamux} from '@chainsafe/libp2p-yamux'; // Use yamux instead of deprecated mplex
import {bootstrap} from '@libp2p/bootstrap';
import {kadDHT} from '@libp2p/kad-dht';
import {multiaddr} from '@multiformats/multiaddr';

export async function createLibp2pNode(peerId, dht) {
    return await createLibp2p({
        peerId: peerId,
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/0/ws',
                '/ip4/0.0.0.0/tcp/0/wss/p2p-webrtc-star'
            ]
        },
        transports: [
            webSockets({filter: filters.all}),
            webRTCStar()
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux()],
        peerDiscovery: [
            bootstrap({
                list: [
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa'
                ]
            })
        ],
        dht: kadDHT({
            clientMode: false,
            protocolPrefix: '/myapp',
            lan: false
        })
    });
}

export async function hybridBootstrap(libp2p, dht, peerId) {
    // Connect to BitTorrent DHT
    await dht.ready()

    // Connect to LibP2P bootstrap nodes
    try {
        await libp2p.start()
        console.log('Libp2p started')
        await libp2p.dial(peerId)
        console.log('Libp2p dialed peerId', peerId)
    } catch (e) {
        console.error('failed to start libp2p', e)
    }

    // Share discovery info between networks
    dht.on('peer', (peer) => {
        try {
            const multiaddrStr = `/ip4/${peer.host}/tcp/${peer.port}/p2p/${peer.peerId.toString()}`
            console.log('DHT peer', multiaddrStr)
            const ma = multiaddr(multiaddrStr)
            libp2p.peerStore.addressBook.add(peer.peerId, [ma])
        } catch (e) {
            console.error('error adding DHT peer to libp2p', e)
        }
    })
}
