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

        // Add additional metadata fields based on the object's properties
        const properties = Object.keys(object).filter(key => key !== 'name');
        properties.forEach(property => {
            const propertyInput = document.createElement('input');
            propertyInput.type = 'text';
            propertyInput.value = object[property];
            propertyInput.placeholder = property;
            propertyInput.readOnly = this.isReadOnly;
            metadataPanel.appendChild(propertyInput);
        });

        return metadataPanel;
    }

    renderMetadataPanel(object) {
        // Implementation to be added later
        return [];
    }

    clearMetadataPanel() {
        // Clear all metadata inputs
        Array.from(metadataPanel.querySelectorAll('input')).forEach(input => input.value = '');
    }

    updatePrivacyIndicator(isPublic) {
        // Update the privacy indicator based on isPublic status
        const privacyIndicator = document.createElement('span');
        privacyIndicator.textContent = isPublic ? 'Public' : 'Private';
        metadataPanel.appendChild(privacyIndicator);
    }
}

export default MetadataManager;