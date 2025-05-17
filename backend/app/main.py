# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.task import Board, Column
from data import _store, ColumnNames, seed_sample
from app.routers.tasks import router as tasks_router

app = FastAPI(title="Task Board API", version="1.0.0")

# Seed one sample task (optional)
seed_sample()

# CORS setup for your Vite frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include CRUD router
app.include_router(tasks_router, prefix="/task", tags=["tasks"])

@app.get("/board", response_model=Board)
def get_board():
    """
    Return the board grouped by column:
    {
      "columns": {
        "todo": { "name": "...", "tasks": [...] },
        ...
      }
    }
    """
    board_dict: dict[str, Column] = {}
    for col_key, display in ColumnNames.items():
        # collect tasks in this column
        tasks = [t for t in _store.values() if t.column == col_key]
        board_dict[col_key] = Column(name=display, tasks=tasks)
    return Board(columns=board_dict)
