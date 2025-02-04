export const insertTagWidget = () => {
    const tagTypes = [
        'Person', 'Place', 'Date', 'Price', 'Task', 'Note', 'Urgency',
        'Category', 'URL', 'Email', 'Phone', 'Address', 'Event', 'Product',
        'Service', 'Location', 'Priority', 'Status', 'Comment', 'Rating', 'Review'
    ];
    const type = prompt(`Enter tag type (options: ${tagTypes.join(', ')})`);
    if (!type) return; // Return early if user cancels prompt

    const value = prompt('Enter tag value:');
    if (!value) return; // Return early if user cancels prompt

    const span = document.createElement('span');
    span.className = 'tag-widget';
    span.dataset.type = type;
    span.dataset.value = value;
    span.contentEditable = 'false';
    span.innerText = `${type}: ${value}`;
    span.addEventListener('dblclick', () => confirm('Remove this tag?') && span.remove());


    insertNodeAtCaret(span);
};

const insertNodeAtCaret = node => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
};