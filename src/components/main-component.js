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

        :host{
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        main {
          display: grid;
          grid-template-columns: 1fr 360px;
          height: 80vh;
          align-items: start;
        }
      </style>
      <main>
        <slot></slot>
      </main>
    `;
  }
}

customElements.define('main-component', Main);
