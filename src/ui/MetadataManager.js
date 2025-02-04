class MetadataManager {
    constructor(isReadOnly) {
        this.isReadOnly = isReadOnly;
    }


    createMetadataPanel(object) {
        const metadataPanel = document.createElement('div');
        metadataPanel.classList.add('metadata-panel');

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = object.name;
        titleInput.placeholder = 'Page Title';
        titleInput.readOnly = this.isReadOnly;
        metadataPanel.appendChild(titleInput);


        // Add metadata content based on the object here
        return metadataPanel;
    }

    // Placeholder methods
    renderMetadataPanel(object) {
        return []; // Return an empty array for now
    }

    clearMetadataPanel() {
        // Implementation to be added later
    }


    updatePrivacyIndicator(isPublic) {
        // Implementation to be added later
    }

    showToast(message) {
        // Implementation to be added later
    }
}


export default MetadataManager;