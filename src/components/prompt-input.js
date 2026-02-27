export class PromptInput extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .container {
          display: flex;
          gap: 12px;
          max-width: 800px;
          width: 95%;
          margin: 0 auto;
        }

        input {
          flex: 1;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: inherit;
          font-size: 0.85rem;
          padding: 10px 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        button {
          padding: 0 20px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        button:hover { background: #3b7be6; }
      </style>
      <div class="container">
        <input type="text" placeholder="Buscar por municipio (ej: Palma, Calvià)..." />
        <button type="submit" id="search-btn">Buscar</button>
      </div>
    `;

    const input = this.shadow.querySelector('input');
    const btn = this.shadow.querySelector('#search-btn');

    if(input.value.length > 4){
      input.addEventListener('input', (e) => {
      document.dispatchEvent(new CustomEvent('search-change', {
          detail: { query: e.target.value },
        bubbles: true
      }));
    });
    }
      
  }
}

customElements.define('prompt-input', PromptInput);


