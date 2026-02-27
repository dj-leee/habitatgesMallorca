export class Logo extends HTMLElement {
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
        .logo {
            display: flex;
            align-items: center;
            gap: var(--gap);
            font-size: 1.5rem;
            font-weight: bold;
            cursor: pointer;
        }
      </style>
      <div class="logo">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('logo-component', Logo);