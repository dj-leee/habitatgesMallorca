import { store } from '../redux/store.js'
import { setPinElement, setPinElements } from '../redux/map-slice.js'

export class Tabla extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' })
        this.data = [];
        this.page = 0;
        this.PAGE_SIZE = 40;
    }

    async connectedCallback() {
        await this.fetchData();
        this.render();
    }

    async fetchData() {
        try {
            const response = await fetch('./data/groupedData.json');
            if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
            
            this.data  = await response.json();
        } catch (error) {
            console.error("Error en Tabla:", error);
        }
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .items-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    max-height: 85vh;
                    overflow-y: auto;
                    padding-right: 4px;
                }

                .items-list::-webkit-scrollbar       { width: 4px; }
                .items-list::-webkit-scrollbar-track { background: transparent; }
                .items-list::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 99px; }
                .items-list::-webkit-scrollbar-thumb:hover { background: var(--accent); }

                .card {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding: 12px 14px;
                    background: var(--card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    cursor: pointer;
                    transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
                    animation: fadeIn 0.25s ease both;
                }

                .card:hover {
                    background: var(--card-hover);
                    border-color: rgba(79, 142, 247, 0.4);
                    transform: translateX(3px);
                }

                .card.active {
                    border-color: var(--accent);
                    background: var(--card-hover);
                }

                .card strong {
                    font-size: 0.84rem;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .card span {
                    font-size: 0.74rem;
                    color: var(--text-soft);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .skeleton {
                    height: 58px;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    background: linear-gradient(90deg, var(--card) 25%, var(--card-hover) 50%, var(--card) 75%);
                    background-size: 400px 100%;
                    animation: shimmer 1.4s infinite linear;
                }

                @keyframes shimmer {
                    from { background-position: -400px 0; }
                    to   { background-position:  400px 0; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .error {
                    padding: 24px;
                    text-align: center;
                    color: var(--text-soft);
                    font-size: 0.85rem;
                }
            </style>
            <ul class="items-list">

            </ul>
        `;
        
        const itemList = this.shadow.querySelector('.items-list');

        Object.keys(this.data).forEach(element => {
            const li = document.createElement('li');
            li.classList.add('group');
            li.dataset.name = element

            const strong  = document.createElement('strong');
            strong.textContent = element;
            
            li.appendChild(strong);
            itemList.appendChild(li);
        });

        // this.data.filter(element => element.latitude && element.longitude).slice(0, 10).forEach((element) => {
        //     const li = document.createElement('li');
        //     li.classList.add('card');
        //     li.dataset.name = element.name ?? '';
        //     li.dataset.latitude = element.latitude ?? '';
        //     li.dataset.longitude = element.longitude ?? '';

        //     const strong  = document.createElement('strong');
        //     strong.textContent = element.name;

        //     const span = document.createElement('span');
        //     span.textContent = element.location || 'Ubicación no disponible';

        //     li.appendChild(strong);
        //     li.appendChild(span);
        //     itemList.appendChild(li);
        // });

        itemList.addEventListener('click', event => {
            if(event.target.closest('.card')){
                const card = event.target.closest('.card');

                const pinElement = {
                    name: card.dataset.name,
                    latitude: card.dataset.latitude,
                    longitude: card.dataset.longitude
                }

                store.dispatch(setPinElement(pinElement))
            }

             if(event.target.closest('.group')){
                const group = event.target.closest('.group');
                store.dispatch(setPinElements(this.data[group.dataset.name]))
            }
        });
    }

    loadMore() {
        const start = this.page * this.PAGE_SIZE;
        const batch = this.data.slice(start, start + this.PAGE_SIZE);

        if (!batch.length) return;

        const fragment = document.createDocumentFragment();
        batch.forEach((item, i) => {
            fragment.appendChild(this.createCard(item, start + i));
        });
        
        this.list.appendChild(fragment);
        this.page++;
    }

    addEventListeners() {
        this.list.addEventListener('scroll', () => {
            const { scrollTop, clientHeight, scrollHeight } = this.list;
            if (scrollTop + clientHeight >= scrollHeight - 200) {
                this.loadMore();
            }
        });

        this.list.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (!card) return;

            this.querySelectorAll('.card.active').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            this.dispatchEvent(new CustomEvent('card-selected', {
                detail: { 
                    address: card.dataset.address,
                    lat: card.dataset.lat,
                    lng: card.dataset.lng,
                    name: card.querySelector('strong').textContent
                },
                bubbles: true
            }));
        });
    }
}

customElements.define('tabla-component', Tabla);