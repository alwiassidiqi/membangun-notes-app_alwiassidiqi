class NoteInput extends HTMLElement {
  constructor() {
    super();

    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.render();
  }

  updateStyle() {
    this._style.textContent = `
        note-input div {
            margin-bottom: 10px    
        }
            
        button {
            display: block;
            font-size: 1.2rem;
            margin-left: auto;
            margin-right: auto;
            padding: 10px 20px 10px 20px;
            width: 30%;
            border-radius: 15px;
            align-item: center;
            
        }

        button:focus {
            background-color: grey;
            color: white;
        }

        label {
            align-contents: center;
            font-size: 20px;
            margin-bottom: 15px;
            vertical-align: middle;
        }

        #titleNote {
            width: 100%;
            height: 3rem;
            margin-top: 5px;
            padding-left: 5px;
        }

        #bodyNote {
            width: 99%;
            height: 10rem;
            padding: 5px;
            font-size: 1.2rem;
            margin-top: 5px;
        }

        #isArchived {
            width: 30px;
            height: 30px;  
            vertical-align: middle;  
            margin-left: 10px;
        }

        input {
            font-size: 1.2rem;
        }
        `;
  }

  render() {
    this.updateStyle();

    const template = `
            ${this._style.outerHTML}
            <h2>Make your note</h2>
            <form id="formList">
            <div>
                <label for="titleNote">Title Note</label><br>
                <input type="text" id="titleNote" required
                aria-describedby="titleValidation">
                <p id="titleValidation" class="validation-message" aria-live="polite"></p>
            </div>
        
            <div>
                <label for="bodyNote">Add Detail</label><br>
                <textarea id="bodyNote" required
                aria-describedby="bodyValidation"></textarea>
                <p id="bodyValidation" class="validation-message" aria-live="polite"></p>
            </div>

            
            <button id="noteSubmit" type="submit">Add</button>
            </form>
        `;

    this.innerHTML = template;
  }
}

customElements.define("note-input", NoteInput);
