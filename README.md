# QuickNotes System

QuickNotes is a simple notes management system designed to demonstrate REST API communication, data modelling, and scalable system architecture.

The project includes a browser-based API client that can load, create, and delete notes using the JSONPlaceholder REST API. It also includes system design documentation covering the API, database model, and application architecture.

## Features

- Load notes from the REST API
- Create new notes using POST
- Delete notes using DELETE
- Display loading, success, and error messages
- Disable buttons while requests are being processed
- Use reusable asynchronous API request handling
- Store data using a relational database design
- Demonstrate a scalable web application architecture

## How to Run the API Client

### Requirements

- A modern web browser
- Visual Studio Code
- Live Server extension for Visual Studio Code

### Steps

1. Clone the repository:

```bash
git clone https://github.com/pwnjue/quicknotes-system.git
```

2. Open the project folder in Visual Studio Code.

3. Open `index.html`.

4. Right-click `index.html` and select **Open with Live Server**.

5. The QuickNotes application will open in your browser.

6. Click **Load notes** to retrieve notes from the server.

7. Use the form to create a new note.

8. Use the **Delete** button to delete a note.

## Documentation

- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [System Architecture](docs/architecture.md)

## API Used

The browser client uses the JSONPlaceholder API for demonstration:

`https://jsonplaceholder.typicode.com/posts`

JSONPlaceholder is a fake REST API designed for testing and learning. POST and DELETE requests are simulated and are not permanently stored on the server.

## What I Learned

### 1. REST API Communication

I learned how to use JavaScript `fetch()` to communicate with a REST API using GET, POST, and DELETE requests. I also learned how to check HTTP response status codes and handle failed requests.

### 2. Asynchronous JavaScript

I learned how to use `async` and `await` with `try`, `catch`, and `finally` to manage asynchronous API requests and provide useful feedback to users.

### 3. Database Design

I learned how to design relational database tables using primary keys and foreign keys. I also learned how one-to-many and many-to-many relationships work.

### 4. System Architecture

I learned how different components such as load balancers, application servers, caches, databases, read replicas, queues, and workers work together in a scalable web application.

### 5. Git and GitHub

I learned how to organize a project into meaningful commits, stage specific files, push changes to GitHub, and maintain a clear project history.

## Project Structure

```text
quicknotes-system/
│
├── index.html
├── api.js
├── style.css
├── README.md
│
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## Project Status

This project was created as a system design and REST API learning project. The API client demonstrates the main CRUD operations while the documentation explains how a production QuickNotes system could be designed to support approximately one million users.
