import { customValidationHandler } from "./form-validation.js";
import "./custom-elements/note-list.js";
import "./custom-elements/note-list-archived.js";
import "./custom-elements/note-input.js";
import "./custom-elements/note-header.js";
import "./custom-elements/loading-indicator.js";
import "./style.css";
import Swal from "sweetalert2";

const BASE_URL = "https://notes-api.dicoding.dev/v2";
const noteListElement = document.querySelector("note-list");
const noteListElementArchived = document.querySelector("note-list-archived");
const LoadingIndicator = document.getElementById("bgLoading");

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const showLoading = () => {
  if (LoadingIndicator) {
    LoadingIndicator.style.display = "flex";
  }
};

const hideLoading = () => {
  if (LoadingIndicator) {
    LoadingIndicator.style.display = "none";
  }
};

const getAllNotes = async () => {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson.data;
    } else {
      Swal.fire({
        icon: "error",
        text: responseJson.message || "Terjadi kesalahan saat mengambil catatan.",
      });
      console.error("Failed to fetch notes:", responseJson.message);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Gagal mengambil catatan. Periksa koneksi internet Anda atau coba lagi nanti.",
    });
    console.error("Error fetching notes:", error);
    alert("Gagal mengambil catatan. Periksa koneksi internet Anda.");
  } finally {
    hideLoading();
  }
};

const getAllArchivedNotes = async () => {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson.data;
    } else {
      Swal.fire({
        icon: "error",
        text: responseJson.message || "Terjadi kesalahan saat mengambil catatan terarsip.",
      });
      console.error("Failed to fetch notes:", responseJson.message);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Gagal mengambil catatan terarsip. Periksa koneksi internet Anda atau coba lagi nanti.",
    });
    console.error("Error fetching notes:", error);
    alert("Gagal mengambil catatan. Periksa koneksi internet Anda.");
  } finally {
    hideLoading();
  }
};

const addNote = async (note) => {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    const responseJson = await response.json();
    if (response.ok) {
      Toast.fire({
        icon: "success",
        text: "Catatan berhasil ditambahkan!",
      });
      return true;
    } else {
      Swal.fire({
        icon: "error",
        text: responseJson.message || "Terjadi kesalahan saat menambahkan catatan.",
      });
      console.error("Failed to add note:", responseJson.message);
      return false;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Gagal menambahkan catatan. Periksa koneksi internet Anda atau coba lagi nanti.",
    });
    console.error("Error adding note:", error);
    return false;
  } finally {
    hideLoading();
  }
};

const deleteNote = async (id) => {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    const responseJson = await response.json();
    if (response.ok) {
      Toast.fire({
        icon: "success",
        text: "Catatan berhasil dihapus!",
      });
      return true;
    } else {
      Swal.fire({
        icon: "error",
        text: responseJson.message || "Terjadi kesalahan saat menghapus catatan.",
      });
      console.error("Failed to delete note:", responseJson.message);
      return false;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Gagal menghapus catatan. Periksa koneksi internet Anda atau coba lagi nanti.",
    });
    console.error("Error deleting note:", error);
    return false;
  } finally {
    hideLoading();
  }
};

const archiveNote = async (id) => {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();
    if (response.ok) {
      Toast.fire({
        icon: "success",
        text: "Catatan berhasil diarsipkan!",
      });
      renderNotes();
    } else {
      Swal.fire({
        icon: "error",
        text: responseJson.message || "Terjadi kesalahan saat mengarsipkan catatan.",
      });
      console.error("Failed to archive note:", responseJson.message);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Gagal mengarsipkan catatan. Periksa koneksi internet Anda atau coba lagi nanti.",
    });
    console.error("Error archiving note:", error);
  } finally {
    hideLoading();
  }
};

const unarchiveNote = async (id) => {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();
    if (response.ok) {
      Toast.fire({
        icon: "success",
        text: "Catatan berhasil diubah ke unarchived!",
      });
      renderNotes();
    } else {
      Swal.fire({
        icon: "error",
        text: responseJson.message || "Terjadi kesalahan saat mengubah status catatan.",
      });
      console.error("Failed to unarchive note:", responseJson.message);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Gagal mengubah catatan ke unarchived. Periksa koneksi internet Anda atau coba lagi nanti.",
    });
    console.error("Error unarchiving note:", error);
  } finally {
    hideLoading();
  }
};

function createDataNotes({ id, title, body, createdAt, archived }) {
  const container = document.createElement("div");
  container.setAttribute("data-noteid", id);
  container.classList.add("note-item");

  const titleElement = document.createElement("h3");
  titleElement.textContent = title;

  const bodyElement = document.createElement("p");
  bodyElement.innerText = body;

  const createdAtElement = document.createElement("p");
  const date = new Date(createdAt);
  createdAtElement.innerHTML = `<b>Create at: </b>` + date.toLocaleString();

  const archivedElement = document.createElement("p");
  archivedElement.innerText = `Status: ${archived ? "Archived" : "Not Archived"}`;

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("note-button");

  const deleteButton = document.createElement("div");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");

  deleteButton.addEventListener("click", async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: "swal2-custom-title",
        confirmButton: "swal2-custom-confirm",
        cancelButton: "swal2-custom-cancel",
      },
    });

    if (result.isConfirmed) {
      const success = await deleteNote(id);
      if (success) {
        renderNotes();
      }
    }
  });

  const archiveButton = document.createElement("div");
  if (archived) {
    archiveButton.textContent = "Unarchive";
    archiveButton.classList.add("unarchive-button");
    archiveButton.addEventListener("click", () => unarchiveNote(id));
  } else {
    archiveButton.textContent = "Archive";
    archiveButton.classList.add("archive-button");
    archiveButton.addEventListener("click", () => archiveNote(id));
  }

  btnContainer.append(deleteButton, archiveButton);
  container.append(titleElement, bodyElement, createdAtElement, archivedElement, btnContainer);
  return container;
}

const renderNotes = async () => {
  const notes = await getAllNotes();
  const archivedNote = await getAllArchivedNotes();

  noteListElement.innerHTML = "";
  noteListElementArchived.innerHTML = "";

  if (notes.length > 0) {
    notes.forEach((noteData) => {
      const element = createDataNotes(noteData);
      noteListElement.append(element);
    });
  } else {
    noteListElement.innerHTML = '<p style="text-align: center; color: grey;">Tidak ada catatan ditemukan.</p>';
  }
  if (archivedNote.length > 0) {
    archivedNote.forEach((noteData) => {
      const element = createDataNotes(noteData);
      noteListElementArchived.append(element);
    });
  } else {
    noteListElementArchived.innerHTML = '<p style="text-align: center; color: grey;">Tidak ada catatan ditemukan.</p>';
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("formList");
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById("titleNote");
    const bodyInput = document.getElementById("bodyNote");

    if (!titleInput.checkValidity() || !bodyInput.checkValidity()) {
      titleInput.reportValidity();
      bodyInput.reportValidity();
      return;
    }

    const title = titleInput.value;
    const body = bodyInput.value;

    const newNote = { title, body };
    const success = await addNote(newNote);
    if (success) {
      titleInput.value = "";
      bodyInput.value = "";
      renderNotes();
    }
  });

  const form = document.querySelector("form");
  const titleInput = form.elements["titleNote"];
  const bodyInput = form.elements["bodyNote"];

  titleInput.addEventListener("change", customValidationHandler);
  bodyInput.addEventListener("change", customValidationHandler);

  titleInput.addEventListener("blur", (event) => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute("aria-describedby");
    const connectedValidationEl = connectedValidationId ? document.getElementById(connectedValidationId) : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = "";
    }
  });

  bodyInput.addEventListener("blur", (event) => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute("aria-describedby");
    const connectedValidationEl = connectedValidationId ? document.getElementById(connectedValidationId) : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = "";
    }
  });

  renderNotes();
});
