/**
 * View for displaying a list of objects.
 */
export default class ListView {
    constructor(objects, pluginManager) {
        this.el = document.createElement('ul');
        this.objects = objects;
    }

    /**
     * Creates a list item for a given object.
     * @param {object} obj - The object to create a list item for.
     * @returns {HTMLElement} The list item element.
     */
    createListItem = obj => {
        const item = document.createElement('li');
        item.textContent = obj.name;

        const editButton = item.appendChild(document.createElement('button'));
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => this.handleEditClick(obj));

        const deleteButton = item.appendChild(document.createElement('button'));
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => this.handleDeleteClick(obj));

        return item;
    };

    /**
     * Handles the edit button click.
     * @param {object} obj - The object to edit.
     */
    handleEditClick(obj) {
        // TODO: Implement edit functionality
    }

    /**
     * Handles the delete button click.
     * @param {object} obj - The object to delete.
     */
    handleDeleteClick(obj) {
        this.objects.delete(obj.id);
        this.render();
    }

    /**
     * Renders the list view.
     */
    render = () => {
        this.el.innerHTML = '';
        Array.from(this.objects.values()).map(this.createListItem).forEach(item => this.el.appendChild(item));
    };
}