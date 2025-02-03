# Collaborative Reality Editor

Organize, prioritize, and grow thoughts into actionable results with real-time communication, matching, and analysis.

## Features

### Objects

-   **Shared Objects (`NObject`s)**
    -   Collaboratively create, prioritize, and manage data.
    -   Represent thoughts and ideas, evolving into tangible, matched results.
    -   Private unless explicitly shared.
    -   **Properties**
        -   **Indefinite:** Describe a hypothetical object, representing a desired state or criteria for a match, and can be refined over time.
        -   **Definite:** Describe the actual characteristics of a real object.

### Search and Match

-   **Persistent Queries**
    -   `NObject`s act as ongoing search interests.
    -   Indefinite properties form these persistent queries.
-   **Semantic Matching**
    -   `NObject`s capture meaning and intent, acting as implicit goals.
    -   Hypothetical objects (defined by indefinite properties) gradually become real as matches are found and definite properties are assigned.
    -   Reflects the evolution of a thought or idea into a concrete result.
-   **Tags**
    -   Descriptive, `NObject`-typed tags (suggested by schemas).
    -   Ensure unambiguous and multilingual exchange.
    -   **Hypersliced:**
        -   Utilize fine-grained interfaces for multiple-inheritance-like semantics.
        -   Applied to Tags for describing semantic `NObject` content and enabling matching.
-   **Notifications**
    -   Receive matches to shared `NObject`s as replies.
    -   Stored for display similar to email or forum threads.

### P2P Network

-   **Decentralized**
    -   Leverages WebRTC for direct peer-to-peer communication.
    -   Optional supernode for advanced applications, large-scale coordination, and fallback.
-   **Synchronized**
    -   Employs `yjs` CRDT for incremental updates and offline editing.
    -   WebRTC for direct peer-to-peer communication (text, voice, video, screensharing).
-   **Secure**
    -   End-to-end encryption protects private data.
    -   Crypto-signing ensures `NObject` integrity and provenance.

### User Interface

-   **Main View**
    -   Unified interface for viewing, creating, and editing `NObject`s.
-   **Sidebar Navigation**
    -   Provides access to:
        -   User profiles ("Me")
        -   Connection updates ("Friends")
        -   Network activity ("Network")
        -   Sortable/filterable data views ("Database")
-   **Dark Mode**
    -   Supported for visual comfort.

## Design

### Data Persistence
-   Client and server persistence are essential, ideally implemented through a common interface.
-   **Server-side:** LevelDB.
-   **Client-side:** Yjs's IndexedDB persistence library for offline capabilities.
-   Database abstraction layer may enhance backend flexibility.
-   **Data Merging:**
    -   Merge all `NObject` content into a new merged object.
    -   Merged object references the "parents" in metadata.
    -   Preserves data and enables eventual further resolution.
-   Tags (semantic schemas)
    -   Defined in JSON files (potentially as JSON schemas or a subset).
    -   Suggest data shapes for organization and procedural UI generation
    -   A rich library of 'hypersliced' tags will provide high expressivity.
    -   A subset may manage the UI, minimizing hardcoded logic.
-   Tags can be used freely (potentially leading to soft conflicts).
-   Real-time Yjs CRDT  synchronized editing to Friends and Peers
    -   Access non-CRDT `NObject`s: searches, cached results, etc..

### Network

-   **Protocols**
    -   UDP Gossip Protocol.
    -   BitTorrent DHT (bootstrap).
    -   LibP2P (bootstrap).
-   **Server (Supernode)**
    -   Optional Node.js-based supernode enhances functionality.
    -   Provides access to networks like IPFS and BitTorrent.
    -   Supernodes fully utilize computer resources for processing, networking, and storage.
    -   Routes network interactions between Socket.IO, libp2p, and other potential networks.
    -   Generic routing architecture with pluggable prioritization and filter heuristics will manage network traffic.
    -   Initial focus is on user experience, with network optimization planned for later stages.
    -   WebSocket connection serves the UI client, providing additional functionality.
    -   Plugins provide support for input (screenshots, etc.) and analysis (OCR, etc.).
    -   Plugin system is flexible, with evolving event handling and interfaces.

### UI
-   Single-page application built with TypeScript/JavaScript.
-   Dynamic components for flexibility and reusability.
-   `yjs` ensures real-time collaborative editing.
-   jQuery is considered for UI construction and manipulation.
    -   Promotes code reuse through a well-organized, object-oriented design.
-   Semantic schemas ("tags") will drive procedural UI generation and management.

## Development

### Build

-   Node.js, TypeScript, NPM.
-   `vite` for fast development and optimized builds.
-   `vitest` for testing.

### Test

-   `npm test`: Runs all test suites (core, server, UI).
-   `npm run test:core`: Runs core tests (node environment).
-   `npm run test:server`: Runs server tests (node environment).
-   `npm run test:ui`: Runs browser-based UI tests.

### Use

1. **Clone:** `git clone <repository URL>` (replace with actual URL)
2. **Install:** `npm install`
3. **Start:** `npm run dev`

### Deploy

1. **Build:** `npm run build`
2. **Start:** `npm start`
3. **Access:** `http://localhost:3000`

### Code

-   Clear, complete, clean, compact, efficient, self-documenting ES6+ code.
-   Comments explain complex logic or design decisions.
-   Use the latest TypeScript and JavaScript language features and APIs, including:
    -   Optional chaining (`?.`).
    -   Nullish coalescing (`??`).
    -   Ternary operators.
    -   Logical OR defaults.
    -   Arrow functions.
    -   Destructuring.
    -   Template literals.
    -   Inline variables.
    -   Compact assertions.
    -   Preference for `const` over `let`.
-   Redundant declarations are removed.
-   Related test cases are combined.
-   Test names are descriptive.

---

Feedback and contributions are welcome.
