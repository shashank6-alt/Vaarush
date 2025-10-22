# app/main.py

"""
Vaarush Backend API
===================
FastAPI backend for managing blockchain-based digital inheritance contracts on Algorand.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Vaarush API",
    description="Digital inheritance platform built on Algorand blockchain",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Data Models ====================

class HeirModel(BaseModel):
    """Model for heir information."""
    address: str
    share: Optional[int] = None


class CreateWillRequest(BaseModel):
    """Request model for creating a will contract."""
    owner_address: str
    asset_id: int
    release_time: int
    heirs: List[HeirModel]


class WillStatusResponse(BaseModel):
    """Response model for will contract status."""
    app_id: str
    owner_address: str
    asset_id: int
    release_time: int
    claimed: bool
    heirs: List[HeirModel]


# ==================== API Endpoints ====================

@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Vaarush API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/api/")
def api_root():
    """API root endpoint."""
    return {
        "message": "Vaarush Digital Inheritance API",
        "status": "operational",
        "endpoints": {
            "health": "/api/health",
            "create_will": "/api/wills/create",
            "get_status": "/api/wills/{app_id}/status",
            "claim_asset": "/api/wills/{app_id}/claim"
        }
    }


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "vaarush-backend",
        "version": "1.0.0"
    }


@app.post("/api/wills/create")
def create_will(request: CreateWillRequest):
    """
    Create a new digital will contract on Algorand blockchain.
    
    Args:
        request: Will creation request with owner, asset, release time, and heirs
        
    Returns:
        Contract creation confirmation with app_id
    """
    # TODO: Implement actual blockchain deployment logic
    # For now, return mock response
    return {
        "app_id": "123456",
        "status": "created",
        "owner_address": request.owner_address,
        "asset_id": request.asset_id,
        "message": "Will contract created successfully"
    }


@app.get("/api/wills/{app_id}/status")
def get_contract_status(app_id: str):
    """
    Get the status of a specific will contract.
    
    Args:
        app_id: Application ID of the contract
        
    Returns:
        Contract status and details
    """
    # TODO: Implement actual blockchain query logic
    # For now, return mock response
    return {
        "app_id": app_id,
        "owner_address": "EXAMPLE_OWNER_ADDRESS",
        "asset_id": 12345,
        "release_time": 1735689600,
        "claimed": False,
        "heirs": [
            {"address": "HEIR_ADDRESS_1", "share": 50},
            {"address": "HEIR_ADDRESS_2", "share": 50}
        ]
    }


@app.post("/api/wills/{app_id}/claim")
def claim_asset(app_id: str):
    """
    Claim assets from a will contract.
    
    Args:
        app_id: Application ID of the contract
        
    Returns:
        Claim transaction details
    """
    # TODO: Implement actual claim logic with Algorand
    # For now, return mock response
    return {
        "app_id": app_id,
        "status": "claimed",
        "txid": "MOCK_TRANSACTION_ID",
        "message": "Asset claimed successfully"
    }


@app.get("/api/wills/user/{user_address}")
def list_user_wills(user_address: str):
    """
    List all will contracts for a specific user.
    
    Args:
        user_address: Algorand address of the user
        
    Returns:
        List of contracts owned by the user
    """
    # TODO: Implement actual query logic
    return {
        "user_address": user_address,
        "contracts": [
            {
                "app_id": "123456",
                "asset_id": 12345,
                "release_time": 1735689600,
                "claimed": False
            }
        ]
    }


# ==================== Run Server ====================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
