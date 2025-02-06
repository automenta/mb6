class AwarenessManager {
    constructor(awareness, editor) {
        this.awareness = awareness;
        this.editor = editor;

        setTimeout(() => {
            this.setupAwareness();
        }, 0);
    }


    updateLocalCursor() {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            this.awareness.setLocalStateField('cursor', {
                anchor: range.startOffset,
                head: range.endOffset
            });
        }
    }


    setupAwareness() {
        // Listen for local cursor changes
        this.editor.addEventListener('mouseup', () => this.updateLocalCursor());
        this.editor.addEventListener('keyup', () => this.updateLocalCursor());


        // Listen for awareness updates
        this.awareness.on('change', () => this.renderRemoteCursors());
    }


    renderRemoteCursors() {
        const states = this.awareness.getStates();
        states.forEach((state, clientId) => {
            if (clientId === this.awareness.clientID) return;
            if (state.cursor) {
                this.renderCursor(state.cursor, state.user);
            }
        });
    }


    renderCursor(cursorData, user) {
        // Try to reuse existing cursor element
        const u = user?.getUser();
        let cursorEle = this.editor.querySelector(`.remote-cursor-${u?.userId}`);

        if (!cursorEle) {
            // Create a new cursor element if it doesn't exist
            cursorEle = document.createElement('span');
            cursorEle.className = `remote-cursor remote-cursor-${u?.userId}`;
            cursorEle.style.position = 'absolute';
            cursorEle.style.width = '2px';
            cursorEle.style.height = '1em';
            cursorEle.style.backgroundColor = u?.color;

            this.editor.append(cursorEle);
        }

        // Position the cursor in the editor
        const position = this.getPositionFromOffset(cursorData.anchor);
        cursorEle.style.left = `${position.left}px`;
        cursorEle.style.top = `${position.top}px`;
        cursorEle.style.backgroundColor = u?.color;
    }


    getPositionFromOffset(offset) {
        const range = document.createRange();
        if (this.editor.childNodes[0]) {
            range.setStart(this.editor.childNodes[0], offset);
        }
        const rect = range.getBoundingClientRect();
        return {left: rect.left, top: rect.top};
    }
}


export default AwarenessManager;
