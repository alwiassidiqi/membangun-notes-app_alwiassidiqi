import notesLogo from "../image/notes.png";
import headerWordLogo from "../image/header-word.png";

class NoteHeader extends HTMLElement {
  constructor() {
    super();

    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.render();
  }

  updateStyle() {
    this._style.textContent = `
            #logo {
                width: 16.538%;
                height: 100%;
            }

            #headerWord {
                width: 42.999%;
                height: 60%;
            }

            note-header div {
                display: flex;
                background-color: #607274;
                padding: 20px 0px;
                align-items: center;
                justify-content: center;
                margin: -10px -20px 0px -20px;
            }
        `;
  }

  render() {
    this.updateStyle();

    const template = `
            ${this._style.outerHTML}
            <div>
                <img src="${notesLogo}" alt="Notes Logo" id="logo">
                <img src="${headerWordLogo}" alt="NoteAPP Header" id="headerWord">
            </div>

        `;

    this.innerHTML = template;
  }
}

customElements.define("note-header", NoteHeader);
