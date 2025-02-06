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
                    <ul>
                        <li><a href="#me" data-navigo>Me</a></li>
                        <li><a href="#friends" data-navigo>Friends</a></li>
                        <li><a href="#network" data-navigo>Network</a></li>
                        <li><a href="#notifications" data-navigo>Notifications</a></li>
                        <li><a href="#database" data-navigo>Database</a></li>
                        <li><a href="#settings" data-navigo>Settings</a></li>
                    </ul>

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
