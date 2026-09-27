# Bridge Forge — Hackathon Project

A developer tool that uses **IBM Bob AI** to automatically detect which files are affected when a backend model field is renamed — saving time and reducing bugs during refactors.

---

## 🚀 What It Does

When a field is renamed on the backend (e.g. `fullName` → `name` on the `User` model), this tool:

1. Sends a prompt to **Bob AI** via the CLI
2. Bob scans the project and identifies affected files (components, API docs, tests)
3. Returns a structured JSON list of affected files with reasons

---

## 📁 Project Structure

```
Bridge Forge/
├── Classify.py       # Core classifier — calls Bob AI to find affected files
├── UserCard.jsx      # Example React component using the User model
├── user.test.js      # Tests for UserCard component
├── API.md            # API documentation for the User object
└── README.md         # This file
```

---

## ⚙️ How to Use

### Prerequisites

- [IBM Bob CLI](https://github.com/IBM/bob) installed and configured
- Python 3.x
- Node.js (for frontend/tests)

### Run the Classifier

```bash
python Classify.py
```

This runs a test case: renaming `fullName` → `name` on the `User` model and prints the affected files.

### Example Output

```json
{
  "affected_files": [
    { "path": "UserCard.jsx", "reason": "Uses user.name from the User model" },
    { "path": "user.test.js", "reason": "Tests the UserCard component with user.name" },
    { "path": "API.md", "reason": "Documents the User object fields" }
  ]
}
```

---

## 🧪 Running Tests

```bash
npm test
```

Tests are written using **React Testing Library** and cover the `UserCard` component.

---

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| AI Engine  | IBM Bob AI (CLI)        |
| Backend    | Python 3                |
| Frontend   | React (JSX)             |
| Testing    | Jest + React Testing Library |
| Docs       | Markdown                |

---

## 📄 API Reference

See [`API.md`](./API.md) for the User object schema.

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin my-feature`
5. Open a Pull Request

---

## 📦 Repository

**GitHub:** https://github.com/binarylaiba/Bridge-Forage-hackathon
