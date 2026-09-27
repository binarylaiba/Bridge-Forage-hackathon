# Project Documentation Context (Non-Obvious Only)

- [`API.md`](../../API.md) documents the *current* backend `User` model — it only has `name: string`. The old field `fullName` is gone.
- [`Classify.py`](../../Classify.py) is both the main script **and** its own test harness — the `if __name__ == "__main__"` block runs a hardcoded rename scenario.
- There is no `package.json` or build config — the JS side has no standalone install/test command documented in the repo.
