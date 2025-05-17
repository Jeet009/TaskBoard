from uuid import uuid4
from pathlib import Path
import json

from app.models.task import Task, ColumnKey

# In-memory store: task_id → Task
_store: dict[str, Task] = {}

# Column display names
ColumnNames: dict[ColumnKey, str] = {
    "todo": "To Do",
    "inprogress": "In Progress",
    "done": "Done",
}

def seed_sample():
    """
    Preload tasks from tasks.json into the in-memory store.
    """
    # 1. Locate the JSON file
    json_path = Path(__file__).parent / "data.json"
    
    # 2. Read and parse
    with json_path.open("r", encoding="utf-8") as f:  # opens file for reading :contentReference[oaicite:1]{index=1}
        tasks_data = json.load(f)                     # load returns a Python list of dicts :contentReference[oaicite:2]{index=2}

    # 3. Convert each dict into a Task and insert into _store
    for item in tasks_data:
        tid = str(uuid4())
        _store[tid] = Task(
            id=tid,
            title=item["title"],
            description=item.get("description", ""),
            column=item.get("column", "todo")
        )
