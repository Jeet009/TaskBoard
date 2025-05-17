# backend/app/data.py

from uuid import uuid4
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
    """(Optional) Preload one sample task."""
    tid = str(uuid4())
    _store[tid] = Task(
        id=tid,
        title="Sample Task",
        description="This is a sample.",
        column="todo"
    )
