export const insertTagWidget = () => {
    const tagTypes = [
        'Person', 'Place', 'Date', 'Price', 'Task', 'Note', 'Urgency',
        'Category', 'URL', 'Email', 'Phone', 'Address', 'Event', 'Product',
        'Service', 'Location', 'Priority', 'Status', 'Comment', 'Rating', 'Review'
    ];
    const type = prompt(`Enter tag type (options: ${tagTypes.join(', ')})`);
    if (!type) return;
    const value = prompt('Enter tag value:');
    if (!value) return;
    const span = document.createElement('span');
    span.className = 'tag-widget';
    span.dataset.type = type;
    span.dataset.value = value;
    span.contentEditable = 'false';
    span.innerText = `${type}: ${value}`;
    span.addEventListener('dblclick', () => {
        if (confirm('Remove this tag?')) span.remove();
    });
    insertNodeAtCaret(span);
};

const insertNodeAtCaret = node => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
};
        