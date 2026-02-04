"""
JWT Token Verification Module
Handles authentication and token validation for protected routes
"""

import jwt
import os
from functools import wraps
from typing import Optional, Dict, Any
import azure.functions as func


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify JWT token and return decoded payload
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload or None if invalid
    """
    try:
        # Get secret from environment
        secret = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")
        
        # Decode and verify token
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_token_from_header(req: func.HttpRequest) -> Optional[str]:
    """
    Extract token from Authorization header
    
    Args:
        req: Azure Function HTTP request
        
    Returns:
        Token string or None
    """
    auth_header = req.headers.get("Authorization", "")
    
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    
    return None


def require_auth(f):
    """
    Decorator to protect routes with JWT authentication
    
    Usage:
        @require_auth
        def my_protected_route(req, user_id):
            # user_id is automatically injected from token
            pass
    """
    @wraps(f)
    def decorated_function(req: func.HttpRequest, *args, **kwargs):
        # Extract token
        token = get_token_from_header(req)
        
        if not token:
            return func.HttpResponse(
                '{"error": "No token provided"}',
                status_code=401,
                mimetype="application/json"
            )
        
        # Verify token
        payload = verify_token(token)
        
        if not payload:
            return func.HttpResponse(
                '{"error": "Invalid or expired token"}',
                status_code=401,
                mimetype="application/json"
            )
        
        # Inject user_id into function
        kwargs['user_id'] = payload.get('user_id')
        
        return f(req, *args, **kwargs)
    
    return decorated_function
