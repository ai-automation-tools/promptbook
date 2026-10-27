---
title: "⚡ Python FastAPI Scaffolding"
tags: ["python", "fastapi", "backend", "api", "boilerplate"]
category: "Development"
subcategory: "Programming"
---

# Python FastAPI Scaffolding

## Purpose
This prompt generates a production-ready boilerplate for a Python FastAPI application. It saves developers time by setting up the necessary directory structure, dependency injection, routing, Pydantic models, and basic CRUD operations, allowing them to focus immediately on business logic rather than framework configuration.

## Instructions

I want you to act as an expert Python Backend Developer specializing in FastAPI.

When I provide the [name of the application] and the [core entity/resource], you should generate a complete, well-structured FastAPI project scaffold.

Your response should include:
- A suggested directory structure following standard domain-driven design or MVC patterns.
- The `main.py` entry point with CORS middleware and API router inclusion.
- A sample Pydantic schema for the [core entity/resource].
- A sample router file with standard CRUD endpoints (Create, Read, Update, Delete).
- A basic `requirements.txt` file.

Please ensure the code includes type hints, async/await syntax where appropriate, and basic docstrings.

**Application Name:** [Insert Application Name]
**Core Entity/Resource:** [Insert Core Entity, e.g., "User", "Product", "Article"]

## Output Format
The output should be formatted as a series of markdown code blocks, each clearly labeled with the filename and its intended location within the directory structure.

## Example

**Input:**
**Application Name:** TaskMaster
**Core Entity/Resource:** Task

**Output:**

Here is a production-ready scaffold for your `TaskMaster` FastAPI application.

### Directory Structure
```text
taskmaster/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── tasks.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py
│   └── core/
│       ├── __init__.py
│       └── config.py
└── requirements.txt
```

### `requirements.txt`
```text
fastapi>=0.100.0
uvicorn[standard]>=0.22.0
pydantic>=2.0.0
```

### `app/core/config.py`
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TaskMaster API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

settings = Settings()
```

### `app/models/task.py`
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4

class TaskBase(BaseModel):
    title: str = Field(..., title="The title of the task", max_length=100)
    description: Optional[str] = Field(None, title="Detailed description")
    is_completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: Optional[str] = Field(None, max_length=100)
    is_completed: Optional[bool] = None

class TaskResponse(TaskBase):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
```

### `app/api/routes/tasks.py`
```python
from fastapi import APIRouter, HTTPException, status
from typing import List
from uuid import UUID
from app.models.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter()

# Mock database
fake_tasks_db = []

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task_in: TaskCreate):
    """Create a new task."""
    new_task = TaskResponse(**task_in.model_dump())
    fake_tasks_db.append(new_task)
    return new_task

@router.get("/", response_model=List[TaskResponse])
async def read_tasks():
    """Retrieve all tasks."""
    return fake_tasks_db

@router.get("/{task_id}", response_model=TaskResponse)
async def read_task(task_id: UUID):
    """Get a specific task by ID."""
    for task in fake_tasks_db:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")
```

### `app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import tasks

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix=f"{settings.API_V1_STR}/tasks", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
```

## Tips for Use
- For larger projects, ask the AI to include database integration (e.g., SQLAlchemy or Beanie) and a `dependencies.py` file for handling database sessions.
- You can pipe the output of this prompt directly into an agent equipped with file system tools (like Aider or Claude Engineer) to have it write the files to your disk automatically.

## Related Prompts
- React Frontend Scaffold
- SQL Database Schema Generator
