/**
 * Componente Tabla
 * Gestiona la carga de datos, el scroll infinito y la visualización de alojamientos.
 */
export class Tabla extends HTMLElement {
    constructor() {
        super();
        this.data = [];
        this.page = 0;
        this.PAGE_SIZE = 40;
    }

    connectedCallback() {
        this.render();
        this.fetchData();
    }

    /**
     * Carga los datos desde el archivo local JSON.
     */
    async fetchData() {
        try {
            const response = await fetch('./data/data.json');
            if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
            
            const json = await response.json();
            this.data = json;
            
            document.dispatchEvent(new CustomEvent('data-ready', {
                detail: { count: this.data.length },
                bubbles: true
            }));

            this.list.innerHTML = '';
            this.loadMore();
        } catch (error) {
            console.error("Error en Tabla:", error);
            this.list.innerHTML = '<li class="error">⚠️ No se pudo cargar la lista de alojamientos.</li>';
        }
    }

    render() {
        this.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                #items-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    max-height: calc(100vh - 160px);
                    overflow-y: auto;
                    padding-right: 4px;
                }

                #items-list::before {
                    content: 'ALOJAMIENTOS';
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    color: var(--text-muted);
                    padding-bottom: 8px;
                }

                #items-list::-webkit-scrollbar       { width: 4px; }
                #items-list::-webkit-scrollbar-track { background: transparent; }
                #items-list::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 99px; }
                #items-list::-webkit-scrollbar-thumb:hover { background: var(--accent); }

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
            <ul id="items-list">
                <li class="skeleton"></li>
                <li class="skeleton"></li>
                <li class="skeleton"></li>
                <li class="skeleton"></li>
                <li class="skeleton"></li>
            </ul>
        `;
        this.list = this.querySelector('#items-list');
        this.addEventListeners();
    }

    createCard(item, index) {
        const li = document.createElement('li');
        li.className = 'card';
        li.dataset.address = item.address ?? '';
        li.dataset.lat = item.latitude ?? '';
        li.dataset.lng = item.longitude ?? '';

        li.innerHTML = `
            <strong>${item.name}</strong>
            <span>${item.location || 'Ubicación no disponible'}</span>
        `;
        return li;
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