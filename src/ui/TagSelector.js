class TagSelector {
    constructor(rootElement, initialTags) {
        this.rootElement = rootElement;
        this.tags = initialTags;
    }

    getTags() {
        const tagInputs = Array.from(this.rootElement.querySelectorAll('.tag-input'));
        return tagInputs.map(input => input.value).filter(value => value !== '');
    }

    addTag(tag) {
        const tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.className = 'tag-input';
        tagInput.value = tag;
        this.rootElement.appendChild(tagInput);
    }

    removeTag(tag) {
        const tagInputs = Array.from(this.rootElement.querySelectorAll('.tag-input'));
        const matchingInput = tagInputs.find(input => input.value === tag);
        if (matchingInput) {
            matchingInput.remove();
        }
    }

    suggestTags(content) {
        return [];
    }
}

export default TagSelector;