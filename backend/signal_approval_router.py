
"""
Verstige OS — Signal Approval Router
Add to your FastAPI app: app.include_router(router)
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os
import sys

# Add current directory to path to import tradelocker_execution
sys.path.append(os.path.dirname(__file__))
from tradelocker_execution import execute_signal_for_user

router = APIRouter(prefix="/api/signals", tags=["signals"])
security = HTTPBearer()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), 
    os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")
)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        print(f"DEBUG AUTH: Received token: {token[:20]}...") 
        user_resp = supabase.auth.get_user(token)
        
        # Check if user_resp has a user object directly or in data
        user = user_resp.user if hasattr(user_resp, 'user') else None
        
        if not user:
            print(f"DEBUG AUTH: Supabase returned no user. Full Resp: {user_resp}")
            raise HTTPException(status_code=401, detail="Invalid session - No user found")
            
        print(f"DEBUG AUTH: Authenticated user ID: {user.id}")
        return user.id
    except Exception as e:
        print(f"DEBUG AUTH FAILED: {str(e)}")
        # If it's already an HTTPException, re-raise it
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=401, detail=f"Unauthorized: {str(e)}")

@router.post("/{signal_id}/approve")
async def approve_signal(
    signal_id: str,
    user_id: str = Depends(get_current_user),
):
    try:
        result = await execute_signal_for_user(user_id=user_id, signal_id=signal_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[ERROR] Execution failed: {e}")
        raise HTTPException(status_code=500, detail=f"Trade execution failed: {str(e)}")

@router.post("/{signal_id}/reject")
async def reject_signal(
    signal_id: str,
    user_id: str = Depends(get_current_user),
):
    try:
        supabase.table("signals").update({"status": "rejected"}).eq("id", signal_id).execute()
        return {"success": True, "message": "Signal rejected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reject signal: {str(e)}")
