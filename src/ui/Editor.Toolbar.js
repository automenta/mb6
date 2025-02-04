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
        const createButton = (text, command) => {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.className = 'toolbar-button';
            button.addEventListener('click', () => document.execCommand(command, false, null));
            return button;
        };

        const boldButton = createButton('<b>B</b>', 'bold');
        const italicButton = createButton('<i>I</i>', 'italic');
        const underlineButton = createButton('<u>U</u>', 'underline');


        const insertMenu = document.createElement('select');
        insertMenu.className = 'toolbar-select';
        insertMenu.innerHTML = `
            <option value="" disabled selected>Insert...</option>
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
        insertTagBtn.className = 'toolbar-button';
        insertTagBtn.addEventListener('click', () => window.insertTagWidget?.());

        this.el.append(
            boldButton,
            italicButton,
            underlineButton,
            insertMenu,
            insertTagBtn
        );
    }
}