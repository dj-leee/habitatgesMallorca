export class Main extends HTMLElement {
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
        main {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: var(--gap);
          padding: var(--gap);
          flex: 1;
          align-items: start;
          overflow-y: hidden;
          
        }
      </style>
      <main>
        <slot></slot>
      </main>
    `;
  }
}

customElements.define('main-component', Main);
