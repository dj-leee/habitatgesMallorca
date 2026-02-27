export class TitleComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        h1 {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin: 0;
        }

        h1 span {
          color: var(--accent);
        }
      </style>
      <h1>Habitatges <span>Mallorca</span></h1>
    `;
  }
}

customElements.define('title-component', TitleComponent);