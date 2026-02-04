"""
Input Validation Utilities
Helper functions for validating request data
"""

import re
from typing import Dict, Any, List, Optional, Tuple


def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email address to validate
        
    Returns:
        True if valid email format
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> Tuple[bool, Optional[str]]:
    """
    Validate that required fields are present in data
    
    Args:
        data: Dictionary to validate
        required_fields: List of required field names
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    missing_fields = []
    
    for field in required_fields:
        if field not in data or data[field] is None or data[field] == "":
            missing_fields.append(field)
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    return True, None


def validate_string_length(value: str, min_length: int = 0, max_length: int = 1000, field_name: str = "Field") -> Tuple[bool, Optional[str]]:
    """
    Validate string length
    
    Args:
        value: String to validate
        min_length: Minimum length
        max_length: Maximum length
        field_name: Name of field for error message
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(value, str):
        return False, f"{field_name} must be a string"
    
    length = len(value)
    
    if length < min_length:
        return False, f"{field_name} must be at least {min_length} characters"
    
    if length > max_length:
        return False, f"{field_name} must be at most {max_length} characters"
    
    return True, None


def validate_task_data(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validate task creation data
    
    Args:
        data: Task data dictionary
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check required fields
    is_valid, error = validate_required_fields(data, ["title"])
    if not is_valid:
        return is_valid, error
    
    # Validate title length
    is_valid, error = validate_string_length(data["title"], min_length=1, max_length=200, field_name="Title")
    if not is_valid:
        return is_valid, error
    
    # Validate description length if provided
    if "description" in data and data["description"]:
        is_valid, error = validate_string_length(data["description"], max_length=2000, field_name="Description")
        if not is_valid:
            return is_valid, error
    
    return True, None


def validate_step_number(step_number: Any, max_steps: int) -> Tuple[bool, Optional[str]]:
    """
    Validate step number
    
    Args:
        step_number: Step number to validate
        max_steps: Maximum number of steps
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(step_number, int):
        return False, "Step number must be an integer"
    
    if step_number < 0:
        return False, "Step number cannot be negative"
    
    if step_number >= max_steps:
        return False, f"Step number must be less than {max_steps}"
    
    return True, None


def sanitize_input(value: str) -> str:
    """
    Sanitize user input to prevent injection attacks
    
    Args:
        value: Input string to sanitize
        
    Returns:
        Sanitized string
    """
    # Remove any potential HTML/script tags
    value = re.sub(r'<[^>]*>', '', value)
    
    # Trim whitespace
    value = value.strip()
    
    return value


def validate_tags(tags: List[str]) -> Tuple[bool, Optional[str]]:
    """
    Validate task tags
    
    Args:
        tags: List of tag strings
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(tags, list):
        return False, "Tags must be an array"
    
    if len(tags) > 10:
        return False, "Maximum 10 tags allowed"
    
    for tag in tags:
        if not isinstance(tag, str):
            return False, "Each tag must be a string"
        
        if len(tag) > 50:
            return False, "Each tag must be at most 50 characters"
    
    return True, None
