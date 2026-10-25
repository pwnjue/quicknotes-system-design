# QuickNotes Data Model

## 1. Overview

The QuickNotes database uses a relational SQL model because notes belong to users, and notes can have multiple tags.

The main entities are:

- `users` — stores user accounts.
- `notes` — stores notes created by users.
- `tags` — stores reusable labels.
- `note_tags` — connects notes to tags and implements the many-to-many relationship.

---

## 2. Entity Relationship Overview

### Users to Notes

One user can create many notes.

**Relationship:** One-to-Many

```text
users 1 ───────────< notes
```
