# Project Coding Rules (Non-Obvious Only)

- `Classify.py` expects Bob's stdout to be **pure JSON** — if you modify the prompt, preserve the `Respond ONLY in this JSON format, nothing else:` instruction or `json.loads(result.stdout)` will throw.
- The `User` model field is `name`, not `fullName`. The rename in `Classify.py` (`fullName` → `name`) is the *test scenario*, not the current shape — don't rename it back.
- No `package.json` exists; do not add one unless specifically asked. JS dependencies are assumed externally installed.
- React component style: named function + `export default` on a separate last line (see [`UserCard.jsx`](../../UserCard.jsx)).
