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
const boldButton = document.createElement('button');
boldButton.innerHTML = '<b>B</b>';
boldButton.className = 'toolbar-button';
boldButton.addEventListener('click', () => {
    document.execCommand('bold', false, null);
});
        const signButton = document.createElement('button');
        signButton.textContent = 'Sign NObject';
        signButton.className = 'toolbar-button'; // Add class to sign button
        signButton.addEventListener('click', () => this.onSign?.(this.object));

const italicButton = document.createElement('button');
italicButton.innerHTML = '<i>I</i>';
italicButton.className = 'toolbar-button';
italicButton.addEventListener('click', () => {
    document.execCommand('italic', false, null);
});
const underlineButton = document.createElement('button');
underlineButton.innerHTML = '<u>U</u>';
underlineButton.className = 'toolbar-button';
underlineButton.addEventListener('click', () => {
    document.execCommand('underline', false, null);
});
        const insertMenu = document.createElement('select');
        insertMenu.className = 'toolbar-select'; // Add class to insert menu
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
        insertTagBtn.className = 'toolbar-button'; // Add class to insert tag button
        insertTagBtn.addEventListener('click', () => window.insertTagWidget?.());

        this.el.append(
boldButton,
italicButton,
underlineButton,
            signButton,
            insertMenu,
            insertTagBtn,
        );

    }
}