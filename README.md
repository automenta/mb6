# Collaborative Reality Editor

Organize, prioritize, and grow thoughts into actionable results with real-time communication, matching, and analysis.

## Features

### Objects

- **Shared Objects:** Create, prioritize, and manage data collaboratively as `NObject`s.
- **Thought Evolution:** `NObject`s describe thoughts and ideas, producing tangible matched results.
- **Privacy by Default:** All `NObject`s are private unless explicitly shared.

### Search and Match

- **Persistent Queries:** `NObject`s can act as ongoing search interests (persistent queries), actively seeking matches
  within the network.
- **Semantic Matching:** `NObject`s capture meaning and intent, acting as implicit goals to realize.
- **Tags:** descriptive `NObject` typed `Tags` (suggested by schemas) ensure unambiguous and multilingual meaningful exchange.
- **Notifications:** The app receives matches to shared `NObject`s as replies, storing them for display similar to email
  or forum replies.

### P2P Network

- **Decentralized:**
    - WebRTC for direct peer-to-peer communication.
    - Optional supernode implementation supporting advanced applications, large-scale coordination, and fallback.
- **Synchronized:**
    - `yjs` CRDT enables incremental updates and offline editing.
    - WebRTC allows direct peer-to-peer communication (text/voice/video/screensharing).
- **Secure:**
    - End-to-end encryption protects private data.
    - Crypto-signing ensures `NObject` integrity and provenance.

### User Interface

- **Main View:** Unified interface for viewing, creating, and editing `NObject`s.
- **Sidebar Navigation:**
    - **Me:** User profile, biography objects, and preferences.
    - **Friends:** Status updates from connections.
    - **Network:** Peer activity and traffic visualization.
    - **Database:** Sortable, filterable data views.
- **Dark Mode:** Supported theme for visual comfort.

## Design

### UI

- Single-page application using TypeScript/JavaScript.
- Dynamic components for flexibility and reusability.
- `yjs` ensures real-time collaborative editing.

jQuery is considered a suitable approach for constructing and manipulating the UI, provided the UI remains reasonably simple and not over-engineered.  A well-organized UI design based on Object-Oriented Programming principles is expected to promote code reuse.  Leveraging semantic schemas ("tags") for procedural UI generation and management is also planned to enhance UI development.

### Server ("Supernode")
The client is designed to operate minimally, even without a server, functioning through static content and WebRTC for basic peer-to-peer collaboration. However, when served by a server (supernode), additional features become available, leveraging the full capabilities of the computer through Node.js. This includes access to other networks like IPFS and BitTorrent, enhancing the application's reach and functionality.

- Node.js-based optional supernode.
- Supernodes can fully utilize a computer to assist with processing, networking, and storage.
### Network Architecture

The server will handle the routing of network interactions between Socket.IO, libp2p, and potentially other networks.  A generic routing architecture is planned, incorporating pluggable prioritization and filter heuristics to manage network traffic effectively.

While network efficiency is a consideration, it is not the primary focus initially. The immediate goal is to enable the user experience, with network optimizations to be addressed in later development stages.  Even a less-than-optimal network implementation is considered sufficient for the initial application functionality.

The interplay of Socket.IO and libp2p, and other networks, will be routed by the server.  We need a generic routing architecture that supports pluggable prioritization and filter heuristics.

Network efficiency is not the primary goal; even a suboptimal network will enable the user experience.  And it can always be improved later.

- WebSocket connection to serve the UI client, providing additional functionality.
- **Network:**
For backend persistence, a popular and easy-to-use Node.js database abstraction layer with good LevelDB support will be chosen to provide flexibility without overcomplicating the design. This abstraction will allow for potential future database system changes.
     - UDP Gossip Protocol.
     - BitTorrent DHT - bootstrap.
Regarding data merging, NObject properties will be concatenated, even in cases of conflict.  (Refer to previous feedback for details implying necessary data structures for merging).
### Data Persistence
Tags (semantic schemas) can be defined in included JSON files, potentially as JSON schemas or a subset. Their purpose is to suggest or detect data shapes, aiding in data organization and UI generation, rather than enforcing strict validation. A rich library of 'hypersliced' tags is envisioned to provide high expressivity across application domains.  A subset of these tags may also be used to specify or manage the UI, minimizing hardcoded business logic or forms.

Complete Yjs synchronization in a decentralized network is not a primary requirement and may be limited to Friends and/or active Peer connections. However, the system will still support receiving non-CRDT NObjects for broader application purposes.

Both client and server persistence are essential, ideally implemented through a common interface to maximize code sharing. Server-side persistence is achieved using LevelDB. Client-side persistence will utilize Yjs's official IndexedDB persistence library for seamless integration and offline capabilities.

To enhance flexibility, a database abstraction layer might be considered for backend persistence. This could provide access to a wider range of database solutions, potentially including LevelDB and others, without overcomplicating the design.

For data management, all NObject content will be merged into new merged objects, which will additionally reference their "parents" in metadata. This approach ensures data preservation and facilitates future data resolution strategies.

It's important to note that while tags can be freely used without strict multiplicity constraints, potentially leading to soft conflicts, the system will not enforce schema validation. However, JSON schemas may be used to suggest data structures and shapes for user guidance.

     - LibP2P - bootstrap.
- **Database:**
     - In-memory caching + persistent storage for durability and scalability.
     - LevelDB.
     - IPFS - decentralized storage.
- **Plugins:**
     - **Input:** Screenshot, etc.
     - **Analysis:** OCR, etc.
     - **Plugin System Flexibility:** The plugin system is designed to be flexible, with event handling mechanisms and plugin interfaces evolving as needed. The purpose of the 'onMessage' plugin event will be determined during further implementation.

## Implementation

### Build

- Node.js, TypeScript, NPM.
- `vite` for fast development and optimized builds.
- `vitest` for testing.

### Test

- `npm test` - Run all test suites (core, server, and UI tests)
- `npm run test:core` - Run core tests (node environment tests for core logic)
- `npm run test:server` - Run server tests (node environment tests for server-side functionality)
- `npm run test:ui` - Run browser-based UI tests (tests that require a browser environment)

## Use

1. Clone the repository:
   `git clone https://github.com/your-organization/collaborative-reality-editor.git` (update with actual repository URL)
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Deploy

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Access the app at `http://localhost:3000`.

### Code

- Clear, complete, clean, compact, efficient, self-documenting ES6+ code.
- Save comments for explaining complex logic or design decisions.
- Use the latest TypeScript and JavaScript language features and APIs, including:
    - Optional chaining (?.)
    - Nullish coalescing (??)
    - Ternary operators
    - Logical OR for default values
    - Arrow functions
    - Destructuring
    - Template literals
    - Inline variable declarations
    - Compact assertion syntax
    - Use const instead of let where possible
- Remove redundant declarations
- Combine related test cases
- Use descriptive test names

---

Feedback and contributions are encouraged to refine and expand the platform.
