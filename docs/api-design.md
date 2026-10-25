# QuickNotes REST API Design

## 1. API Overview

The QuickNotes API is a RESTful API that allows users to create, read, update, and delete notes. It also supports user and tag management.

Base URL:

`https://api.quicknotes.example.com/v1`

The API uses JSON for request and response bodies.

---

## 2. REST Endpoints

| Method | Endpoint      | Description                           | Success Status |
| ------ | ------------- | ------------------------------------- | -------------- |
| GET    | `/notes`      | List notes for the authenticated user | 200 OK         |
| GET    | `/notes/{id}` | Get one note by ID                    | 200 OK         |
| POST   | `/notes`      | Create a new note                     | 201 Created    |
| PATCH  | `/notes/{id}` | Update an existing note               | 200 OK         |
| DELETE | `/notes/{id}` | Delete a note                         | 204 No Content |
| GET    | `/users/{id}` | Get a user's profile                  | 200 OK         |
| POST   | `/tags`       | Create a new tag                      | 201 Created    |
| GET    | `/tags`       | List available tags                   | 200 OK         |

---

## 3. List Notes

### Request

```http
GET /v1/notes?limit=10&page=1
Authorization: Bearer <access-token>
Accept: application/json
```
