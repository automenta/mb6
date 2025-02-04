
export default class EditorToolbar {
    constructor({onInsertSemantic, onSign, object, pluginManager}) {
        this.onInsertSemantic = onInsertSemantic;
        this.onSign = onSign;
        this.object = object;
        this.pluginManager = pluginManager;

        this.el = document.createElement('div');
        this.el.className = 'editor-toolbar';
        this.buildToolbar();
    }

    get element() {
        return this.el;
    }

    buildToolbar() {
        const signButton = document.createElement('button');
        signButton.textContent = 'Sign NObject';
        signButton.addEventListener('click', () => this.onSign?.(this.object));

        const insertMenu = document.createElement('select');
        insertMenu.innerHTML = `
                    <option value="" disabled selected>Insert semantic widget...</option>
                    ${['Person', 'Place', 'Date', 'Price'].map(type => `<option value="${type}">${type} Class</option>`).join('')}
                `;
        insertMenu.addEventListener('change', () => {
            if (insertMenu.value) {
                this.onInsertSemantic?.(this.object, insertMenu.value);
                insertMenu.value = '';
            }
        });

        const insertTagBtn = document.createElement('button');
        insertTagBtn.type = 'button';
        insertTagBtn.textContent = 'Insert Tag';
        insertTagBtn.addEventListener('click', () => window.insertTagWidget?.());

        this.el.append(
            signButton,
            insertMenu,
            insertTagBtn,
        );

    }
}