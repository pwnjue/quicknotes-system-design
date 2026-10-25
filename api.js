
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const status = document.getElementById("status");
const notesList = document.getElementById("notes-list");

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

        listItem.appendChild(title);
        listItem.appendChild(body);
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
        status.textContent = "Sorry, we could not load the notes. Please try again.";
        status.className = "error";
        console.error(error);
    } finally {
        loadBtn.disabled = false;
    }
}

loadBtn.addEventListener("click", loadNotes);