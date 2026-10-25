const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const status = document.getElementById("status");
const notesList = document.getElementById("notes-list");

const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

function displayNotes(notes) {
    notesList.textContent = "";

    if (notes.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No notes found.";
        notesList.appendChild(emptyMessage);
        return;
    }

    notes.forEach(note => {
        const listItem = document.createElement("li");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const body = document.createElement("p");
        body.textContent = note.body;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            deleteNote(note.id, listItem, deleteBtn);
        });

        listItem.appendChild(title);
        listItem.appendChild(body);
        listItem.appendChild(deleteBtn);

        notesList.appendChild(listItem);
    });
}

async function loadNotes() {
    loadBtn.disabled = true;
    status.textContent = "Loading notes...";
    status.className = "";

    try {
        const notes = await request(`${API_URL}?_limit=10`);

        displayNotes(notes);

        status.textContent = `Loaded ${notes.length} notes from the server.`;
        status.className = "success";
    } catch (error) {
        status.textContent =
            "Sorry, we could not load the notes. Please try again.";
        status.className = "error";
        console.error(error);
    } finally {
        loadBtn.disabled = false;
    }
}

async function createNote(event) {
    event.preventDefault();

    submitBtn.disabled = true;
    status.textContent = "Creating note...";
    status.className = "";

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    try {
        const newNote = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        const listItem = document.createElement("li");

        const titleElement = document.createElement("h3");
        titleElement.textContent = newNote.title;

        const bodyElement = document.createElement("p");
        bodyElement.textContent = newNote.body;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            deleteNote(newNote.id, listItem, deleteBtn);
        });

        listItem.appendChild(titleElement);
        listItem.appendChild(bodyElement);
        listItem.appendChild(deleteBtn);

        notesList.prepend(listItem);

        status.textContent =
            `Note created (status 201, id ${newNote.id}).`;
        status.className = "success";

        noteForm.reset();
    } catch (error) {
        status.textContent =
            "Sorry, we could not create the note. Please try again.";
        status.className = "error";
        console.error(error);
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteNote(noteId, listItem, deleteBtn) {
    deleteBtn.disabled = true;
    status.textContent = "Deleting note...";
    status.className = "";

    try {
        await request(`${API_URL}/${noteId}`, {
            method: "DELETE"
        });

        listItem.remove();

        status.textContent = `Note deleted (status 200, id ${noteId}).`;
        status.className = "success";

        // JSONPlaceholder simulates DELETE requests but does not permanently
        // remove data from its server.
    } catch (error) {
        deleteBtn.disabled = false;
        status.textContent =
            "Sorry, we could not delete the note. Please try again.";
        status.className = "error";
        console.error(error);
    }
}

loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);