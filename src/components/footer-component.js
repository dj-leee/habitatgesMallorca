export class FooterComponent extends HTMLElement {
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
        footer {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          background-color: #333;
          color: #fff;
        }
      </style>
      <footer>
        <slot></slot>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);