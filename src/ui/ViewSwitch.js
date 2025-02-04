export default class ViewSwitch {
    constructor({onNavigate}) {
        this.onNavigate = onNavigate;
        const el = document.createElement('div');
        el.id = 'view-switch';
        el.innerHTML = `
            <ul>
                <li><a href="#me" data-navigo>Me</a></li>
                <li><a href="#friends" data-navigo>Friends</a></li>
                <li><a href="#network" data-navigo>Network</a></li>
                <li><a href="#notifications" data-navigo>Notifications</a></li>
                <li><a href="#database" data-navigo>Database</a></li>
            </ul>
        `;
        el.addEventListener('click', ({target}) => {
            if (target.tagName === 'A' && target.dataset.navigo) {
                this.onNavigate(target.getAttribute('href'));
            }
        });
        this.el = el;
    }
}