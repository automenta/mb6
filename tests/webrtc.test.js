import { expect, test, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';

/*
IMPORTANT CHROMIUM PARANOIA MITIGATION for puppeteer
  Temporarily enable user namespaces (until reboot):
  sudo sysctl kernel.unprivileged_userns_clone=1

  Permanently enable them:
  echo "kernel.unprivileged_userns_clone=1" | sudo tee /etc/sysctl.d/99-userns.conf
  sudo sysctl --system
*/
import puppeteer from 'puppeteer';

let browser1, browser2, page1, page2;
let testCounter = 0; // Counter for unique room names

beforeAll(async () => {
    browser1 = await puppeteer.launch();
    page1 = await browser1.newPage();
    browser2 = await puppeteer.launch();
    page2 = await browser2.newPage();
});

beforeEach(async () => {
    testCounter++;
    // Render the app component before each test
    const port = globalThis.serverPort; // Get the port from setup.js
    // Navigate to a blank page first
    await page1.goto('about:blank');
    await page2.goto('about:blank');
    await page1.goto(`http://localhost:${port}/#network`);
    await page2.goto(`http://localhost:${port}/#network`);

    await page1.evaluate(async (testCounter) => {
        const Y = await import('yjs');
        const { Awareness } = await import('y-protocol/awareness.js');
        window.Y = Y;
        window.Awareness = Awareness;
        const ydoc = new Y.Doc();
        const awareness = new Awareness(ydoc);
        const objectManager = new ObjectManager();
        const layoutManager = new LayoutManager();
        const notifier = new Notifier();
        // Use a unique room name for each test
        window.app = new App(objectManager, layoutManager, notifier, ydoc, awareness, `test-room-${testCounter}`);
        window.app.render();

    }, testCounter);
    await page2.evaluate(async (testCounter) => {
        const Y = await import('yjs');
        const { Awareness } = await import('y-protocol/awareness.js');
        window.Y = Y;
        window.Awareness = Awareness;
        const ydoc = new Y.Doc();
        const awareness = new Awareness(ydoc);
        const objectManager = new ObjectManager();
        const layoutManager = new LayoutManager();
        const notifier = new Notifier();
        // Use a unique room name for each test
        window.app = new App(objectManager, layoutManager, notifier, ydoc, awareness, `test-room-${testCounter}`);
        window.app.render();
    }, testCounter);
});

async function cleanup(page) {
    try {
        await page.evaluate(() => {
            if (window.app) {
                if (window.app.webrtc) {
                    window.app.webrtc.disconnect();
                    window.app.webrtc.destroy();
                }
                if (window.app.ydoc) {
                    window.app.ydoc.destroy();
                }
                if (window.app.awareness) {
                    window.app.awareness.destroy();
                }
            }
        });
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}


afterEach(async () => {
    // Destroy the app component after each test
    await cleanup(page1);
    await cleanup(page2);
});

afterAll(async () => {
    await browser1.close();
    await browser2.close();
});

test('WebRTC establishes connection between two browsers', async () => {
    const port = globalThis.serverPort; // Get the port from setup.js
    await page1.goto(`http://localhost:${port}/#network`);
    await page2.goto(`http://localhost:${port}/#network`);

    // Add an element with id 'connect-btn' and 'connection-status' to the NetworkView
    await page1.evaluate(() => {
        const networkView = document.querySelector('#network-view');

        const connectBtn = document.createElement('button');
        connectBtn.id = 'connect-btn';
        connectBtn.textContent = 'Connect';
        networkView.appendChild(connectBtn);

        const connectionStatus = document.createElement('div');
        connectionStatus.id = 'connection-status';
        networkView.appendChild(connectionStatus);
    });
    await page2.evaluate(() => {
        const networkView = document.querySelector('#network-view');

        const connectBtn = document.createElement('button');
        connectBtn.id = 'connect-btn';
        connectBtn.textContent = 'Connect';
        networkView.appendChild(connectBtn);

        const connectionStatus = document.createElement('div');
        connectionStatus.id = 'connection-status';
        networkView.appendChild(connectionStatus);
    });

    // Simulate clicking the connect button
    await Promise.all([
        page1.click('#connect-btn'),
        page2.click('#connect-btn')
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const connectedMessage1 = await page1.$eval('#connection-status', el => el.textContent);
    const connectedMessage2 = await page2.$eval('#connection-status', el => el.textContent);

    expect(connectedMessage1).toContain('Connected');
    expect(connectedMessage2).toContain('Connected');
}, 10000);

test('WebRTC synchronizes NObjects between two browsers', async () => {
    const port = globalThis.serverPort; // Get the port from setup.js
    await page1.goto(`http://localhost:${port}/#nObjects`);
    await page2.goto(`http://localhost:${port}/#nObjects`);

    // Add necessary elements for creating and displaying NObjects
    await page1.evaluate(() => {
        // Add a button for creating NObjects
        const createBtn = document.createElement('button');
        createBtn.id = 'create-nobject';
        document.body.appendChild(createBtn);

        // Add input fields for name and content
        const nameInput = document.createElement('input');
        nameInput.id = 'name-input';
        document.body.appendChild(nameInput);

        const contentEditor = document.createElement('div');
        contentEditor.id = 'content-editor';
        contentEditor.contentEditable = true;
        document.body.appendChild(contentEditor);

        const saveBtn = document.createElement('button');
        saveBtn.id = 'save-nobject';
        document.body.appendChild(saveBtn);
    });

    // Create an NObject in the first browser
    await page1.click('#create-nobject');
    await page1.type('#name-input', 'Test NObject');
    await page1.type('#content-editor', 'Test Content');
    await page1.click('#save-nobject');

    // Wait for the NObject to appear in the second browser
    await page2.waitForSelector('.nobject-thumbnail', { timeout: 5000 });

    const nObjectName1 = await page1.$eval('.nobject-thumbnail', el => el.textContent);
    const nObjectName2 = await page2.$eval('.nobject-thumbnail', el => el.textContent);

    expect(nObjectName1).toBe('Test NObject');
    expect(nObjectName2).toBe('Test NObject');
}, 10000);
