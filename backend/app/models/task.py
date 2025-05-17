# backend/app/models.py

from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict

# Define allowed column keys
ColumnKey = Literal["todo", "inprogress", "done"]

class Task(BaseModel):
    id: str
    title: str = Field(..., min_length=1)
    description: str = ""
    column: ColumnKey

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = ""
    column: Optional[ColumnKey] = "todo"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    column: Optional[ColumnKey] = None

class Column(BaseModel):
    name: str
    tasks: List[Task]

class Board(BaseModel):
    columns: Dict[ColumnKey, Column]
