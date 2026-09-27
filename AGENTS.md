# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Purpose
Hackathon demo: uses IBM Bob CLI (`bob run --prompt <prompt>`) to classify which files are affected by backend model field renames. [`Classify.py`](Classify.py) is the main entry point.

## Stack
- React (JSX) frontend component ([`UserCard.jsx`](UserCard.jsx))
- Python script ([`Classify.py`](Classify.py)) that shells out to Bob
- Tests written with `@testing-library/react` (Jest runner assumed — no `package.json` present in repo)

## Commands
No `package.json` exists. Test runner and exact commands are not configured in the repo. Typical invocation:
```bash
# Run the Bob classifier directly
python Classify.py

# Run JS tests (assumes Jest + @testing-library/react installed externally)
npx jest user.test.js
```

## Critical Patterns

### Bob CLI integration
[`Classify.py`](Classify.py) calls Bob via `subprocess.run(["bob", "run", "--prompt", prompt], ...)`.
- Bob **must be on PATH** (`bob` binary available) for this to work.
- The prompt instructs Bob to return **only** a JSON object with an `affected_files` array — any extra prose will cause `json.loads` to fail.
- `timeout=120` seconds is set; long Bob responses will raise `subprocess.TimeoutExpired`.

### User model field name
The canonical field is `name` (not `fullName`). [`API.md`](API.md), [`UserCard.jsx`](UserCard.jsx), and [`user.test.js`](user.test.js) all use `name`. The rename scenario in `Classify.py` (`fullName` → `name`) is the example change being classified, not the current state.

## Code Style
- React components: named function declarations, default export at bottom.
- Python: no type hints used; keep prompts as f-strings inline in the function.
- No linter config present — follow existing minimal style.
