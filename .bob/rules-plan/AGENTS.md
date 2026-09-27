# Project Architecture Rules (Non-Obvious Only)

- The architecture is: Python script → Bob CLI → JSON response. Bob does all the file-impact analysis; `Classify.py` is just an orchestrator.
- Bob prompt output must be parseable JSON with key `affected_files` (array of `{path, reason}` objects) — any architectural change that alters the response schema requires updating `Classify.py`'s parser too.
- The JS layer (React component + tests) exists purely as *target files* for Bob to analyze, not as an independent app. There is no routing, state management, or backend call from the JS side.
- No CI, no linter, no formatter configured — any tooling additions should be lightweight and not assume npm workspaces.
