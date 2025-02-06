class MetadataManager {
    constructor(isReadOnly) {
        this.isReadOnly = isReadOnly;
    }


    createMetadataPanel(object) {
        const metadataPanel = document.createElement('div');
        metadataPanel.classList.add('metadata-panel');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = object.name;
        nameInput.placeholder = 'Page Title';
        nameInput.readOnly = this.isReadOnly;
        metadataPanel.appendChild(nameInput);

        this.nameInput = nameInput;


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

}


export default MetadataManager;