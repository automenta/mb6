import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { webRTCStar } from '@libp2p/webrtc-star';
import * as filters from '@libp2p/websockets/filters';
import { noise } from '@libp2p/noise';
import { yamux } from '@chainsafe/libp2p-yamux'; // Use yamux instead of deprecated mplex
import { bootstrap } from '@libp2p/bootstrap';
import { kadDHT } from '@libp2p/kad-dht';

const libp2p = await createLibp2p({
  peerId: this.peerId,
  addresses: {
    listen: [
      '/ip4/0.0.0.0/tcp/0/ws',
      '/ip4/0.0.0.0/tcp/0/wss/p2p-webrtc-star'
    ]
  },
  transports: [
    webSockets({ filter: filters.all }),
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

export async function hybridBootstrap() {
  // Connect to BitTorrent DHT
  await this.dht.ready()
  
  // Connect to LibP2P bootstrap nodes
  await libp2p.start()
  await libp2p.dial(peerId)
  
  // Share discovery info between networks
  this.dht.on('peer', (peer) => {
    libp2p.peerStore.addressBook.add(peer)
  })
}
