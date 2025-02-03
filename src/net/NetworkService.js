import {WebsocketProvider} from 'y-websocket';
import {nanoid} from 'nanoid';

export default class NetworkService {
    constructor(doc) {
        this.provider = new WebsocketProvider(
            `ws://${import.meta.env.VITE_WEBSOCKET_HOST ?? 'localhost'}:${import.meta.env.VITE_WEBSOCKET_PORT ?? 3001}`,
            'nobject-editor',
            doc
        );
        this.awareness = this.provider.awareness;
        this.initAwareness();
    }

    initAwareness = () => {
        this.awareness.setLocalStateField('user', {
            name: `User-${nanoid(4)}`,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        });
        this.awareness.on('change', () => console.log('Awareness update:', this.awareness.getStates()));
    }
}
        