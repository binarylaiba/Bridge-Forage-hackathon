import subprocess
import json

def classify_affected_files(change):
    """
    change: {"field_old": "fullName", "field_new": "name", "model": "User"}
    
    Bob ko prompt bhejta hai aur affected files ki list wapis deta hai.
    """

    prompt = f"""
Assume the "{change['field_old']}" field was renamed to "{change['field_new']}" in the {change['model']} model on the backend.

Look through the project and find which files use this field (frontend components, API docs, tests), and tell me:
1. Which files are affected
2. Why they're affected

Respond ONLY in this JSON format, nothing else:
{{
  "affected_files": [
    {{"path": "...", "reason": "..."}}
  ]
}}
"""

    # Bob ko command line se call karo
    result = subprocess.run(
        ["bob", "run", "--prompt", prompt],
        capture_output=True,
        text=True,
        timeout=120
    )

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        print("Bob ka output JSON nahi tha:", result.stdout)
        return {"affected_files": []}


# Test karne ke liye
if __name__ == "__main__":
    test_change = {"field_old": "fullName", "field_new": "name", "model": "User"}
    result = classify_affected_files(test_change)
    print(json.dumps(result, indent=2))