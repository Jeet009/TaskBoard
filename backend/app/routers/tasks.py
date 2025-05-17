# backend/app/routers/tasks.py

from fastapi import APIRouter, HTTPException
from uuid import uuid4
from typing import Dict

from app.models.task import Task, TaskCreate, TaskUpdate
from data import _store, ColumnNames

router = APIRouter()

@router.post("", response_model=Task)
def create_task(data: TaskCreate):
    tid = str(uuid4())
    task = Task(id=tid, title=data.title, description=data.description or "", column=data.column)
    _store[tid] = task
    return task

@router.get("/{task_id}", response_model=Task)
def read_task(task_id: str):
    if task_id not in _store:
        raise HTTPException(404, "Task not found")
    return _store[task_id]

@router.put("/{task_id}", response_model=Task)
def update_task(task_id: str, data: TaskUpdate):
    if task_id not in _store:
        raise HTTPException(404, "Task not found")
    task = _store[task_id]
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    if data.column is not None:
        if data.column not in ColumnNames:
            raise HTTPException(400, "Invalid column")
        task.column = data.column
    _store[task_id] = task
    return task

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: str):
    if task_id not in _store:
        raise HTTPException(404, "Task not found")
    del _store[task_id]
