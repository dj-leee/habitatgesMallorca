export class HeaderComponent extends HTMLElement {
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
          --bg: #0d1117;
          --surface: #161b22;
          --accent: #4f8ef7;
          --border: rgba(255, 255, 255, 0.07);
        }

        header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        h1 {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin: 0;
        }

        h1 span {
          color: var(--accent);
        }

        @media (min-width: 600px) {
          header {
            flex-direction: row;
            justify-content: space-between;
          }

          .header-content {
            width: auto;
          }
        }
      </style>
      <header>
          <div class="header-content">
            <slot></slot>
          </div>
      </header>
    `;
  }
}

customElements.define('header-component', HeaderComponent);