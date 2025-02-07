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
              item.dataset.id = obj.id;

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
         // Navigate to the editor view for the selected object
        window.location.hash = `#editor/${obj.id}`;
        // TODO: Implement edit functionality
    }

    /**
     * Handles the delete button click.
     * @param {object} obj - The object to delete.
     */
    handleDeleteClick(obj) {
        DB.deleteObject(obj);
    }

    /**
     * Renders the list view.
     */
    render = () => {
        this.el.innerHTML = '';
        Array.from(this.objects.values()).map(this.createListItem).forEach(item => this.el.appendChild(item));
    addObject = (obj) => {
        const item = this.createListItem(obj);
        this.el.appendChild(item);
    };

    updateObject = (obj) => {
        const item = this.el.querySelector(`[data-id='${obj.id}']`);
        if (item) {
            item.textContent = obj.name; // Update the text content
        }
    };

    deleteObject = (id) => {
        const item = this.el.querySelector(`[data-id='${id}']`);
        if (item) {
            item.remove();
        }
    };
    };
}