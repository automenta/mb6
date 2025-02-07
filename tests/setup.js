import { beforeAll, afterAll } from 'vitest';
import { createServer } from 'vite';

let server;

// Store the server's port in a global variable
globalThis.serverPort = undefined; // Initialize to undefined

beforeAll(async () => {
    server = await createServer({
        configFile: false,
        root: process.cwd(),
        server: {
            port: 0,
            open: false
        }
    });
    await server.listen();

    // Assign the actual port to the global variable
    globalThis.serverPort = server.config.server.port;
    console.log(`Server started on port ${globalThis.serverPort}`);
}, 10000);

afterAll(async () => {
    await server.close();
});