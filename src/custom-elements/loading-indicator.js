class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            Loading data...
        </div>
        `;
  }
}

customElements.define("loading-indicator", LoadingIndicator);
