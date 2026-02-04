"""
Database Schema Definitions
Defines data models for users, tasks, and steps
"""

from typing import List, Optional
from datetime import datetime
from dataclasses import dataclass, field


@dataclass
class User:
    """User model"""
    user_id: str
    email: str
    name: str
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    auth_provider: str = "email"  # email, google, github, etc.
    
    def to_dict(self):
        """Convert to dictionary for database storage"""
        return {
            "user_id": self.user_id,
            "email": self.email,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "auth_provider": self.auth_provider
        }


@dataclass
class TaskStep:
    """Individual step within a task"""
    step_number: int
    description: str
    completed: bool = False
    completed_at: Optional[datetime] = None
    estimated_minutes: int = 10
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "step_number": self.step_number,
            "description": self.description,
            "completed": self.completed,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "estimated_minutes": self.estimated_minutes
        }


@dataclass
class Task:
    """Task model with micro-wins steps"""
    task_id: str
    user_id: str
    title: str
    description: str = ""
    steps: List[TaskStep] = field(default_factory=list)
    current_step: int = 0
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    tags: List[str] = field(default_factory=list)
    
    def to_dict(self):
        """Convert to dictionary for database storage"""
        return {
            "task_id": self.task_id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "steps": [step.to_dict() for step in self.steps],
            "current_step": self.current_step,
            "completed": self.completed,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "tags": self.tags
        }
    
    def get_current_step(self) -> Optional[TaskStep]:
        """Get the current active step"""
        if 0 <= self.current_step < len(self.steps):
            return self.steps[self.current_step]
        return None
    
    def mark_step_complete(self, step_number: int) -> bool:
        """Mark a step as completed and move to next"""
        if step_number < len(self.steps):
            self.steps[step_number].completed = True
            self.steps[step_number].completed_at = datetime.utcnow()
            self.current_step = step_number + 1
            self.updated_at = datetime.utcnow()
            
            # Check if all steps completed
            if self.current_step >= len(self.steps):
                self.completed = True
                self.completed_at = datetime.utcnow()
            
            return True
        return False
    
    def get_progress(self) -> dict:
        """Calculate task progress"""
        total_steps = len(self.steps)
        completed_steps = sum(1 for step in self.steps if step.completed)
        
        return {
            "total_steps": total_steps,
            "completed_steps": completed_steps,
            "percentage": round((completed_steps / total_steps * 100), 2) if total_steps > 0 else 0,
            "current_step": self.current_step
        }


# Database collection/table names
COLLECTIONS = {
    "users": "users",
    "tasks": "tasks",
    "sessions": "sessions"
}


# SQL Schema for PostgreSQL (if needed)
SQL_SCHEMA = """
-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    auth_provider VARCHAR(50) DEFAULT 'email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    task_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL,
    current_step INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    tags JSONB,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
"""
