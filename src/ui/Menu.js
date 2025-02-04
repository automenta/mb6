export default class Menu {
    constructor({onNavigate, objects, uiManager}) {
        this.onNavigate = onNavigate;
        this.objects = objects;
        this.uiManager = uiManager;
        const el = document.createElement('div');
        el.id = 'menu';
        el.className = 'menu'; // Add menu class
        el.innerHTML = `
            <button id="create-nobject" class="menu-button">+</button>
            <select id="view-selector">
                <option value="#me" data-navigo>Me</option>
                <option value="#friends" data-navigo>Friends</option>
                <option value="#network" data-navigo>Network</option>
                <option value="#notifications" data-navigo>Notifications</option>
                <option value="#database" data-navigo>Database</option>
                <option value="#settings" data-navigo>Settings</option>
            </select>

        `;

        const viewSelector = el.querySelector('#view-selector');
        viewSelector.addEventListener('change', ({ target }) => {
            this.onNavigate(target.value);

        });


        el.addEventListener('click', ({ target }) => {
            if (target.dataset.navigo) {
                this.onNavigate(target.getAttribute('href'));
            } else if (target.id === 'create-nobject') {
                const newNObject = this.uiManager.createNObject('Untitled', '', {}, []);
                this.onNavigate(`#editor/${newNObject.id}`);
            }
        });
        this.el = el;
    }
}
