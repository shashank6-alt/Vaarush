# src/api/routes/contract.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from utils.algorand import deploy_contract, register_heir_tx, claim_asset_tx, get_app_state

router = APIRouter(prefix="/contract", tags=["Smart Contract"])

class DeployRequest(BaseModel):
    owner_address: str
    heir_address: str
    asset_id: int
    release_time: int

class DeployResponse(BaseModel):
    app_id: int
    txn_id: str
    message: str

class RegisterHeirRequest(BaseModel):
    app_id: int
    heir_address: str
    sender_address: str

class ClaimRequest(BaseModel):
    app_id: int
    heir_address: str

class StatusResponse(BaseModel):
    app_id: int
    owner: str
    heir: str
    asset_id: int
    release_time: int
    claimed: bool

@router.post("/deploy", response_model=DeployResponse)
async def deploy(request: DeployRequest):
    """
    Deploy a new inheritance smart contract.
    Returns app ID and transaction ID.
    """
    try:
        app_id, txn_id = deploy_contract(
            owner=request.owner_address,
            heir=request.heir_address,
            asset_id=request.asset_id,
            release_time=request.release_time
        )
        return DeployResponse(
            app_id=app_id,
            txn_id=txn_id,
            message="Contract deployed successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deployment failed: {str(e)}")

@router.post("/register_heir")
async def register_heir(request: RegisterHeirRequest):
    """
    Register or update heir for an existing contract.
    """
    try:
        txn_id = register_heir_tx(
            app_id=request.app_id,
            heir=request.heir_address,
            sender=request.sender_address
        )
        return {"txn_id": txn_id, "message": "Heir registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heir registration failed: {str(e)}")

@router.post("/claim")
async def claim(request: ClaimRequest):
    """
    Claim inheritance asset as registered heir.
    Only callable after release time and by the designated heir.
    """
    try:
        txn_id = claim_asset_tx(
            app_id=request.app_id,
            heir=request.heir_address
        )
        return {"txn_id": txn_id, "message": "Asset claimed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Claim failed: {str(e)}")

@router.get("/status/{app_id}", response_model=StatusResponse)
async def status(app_id: int):
    """
    Get current state of an inheritance contract.
    """
    try:
        state = get_app_state(app_id)
        return StatusResponse(
            app_id=app_id,
            owner=state["owner"],
            heir=state["heir"],
            asset_id=state["asset_id"],
            release_time=state["release_time"],
            claimed=state["claimed"]
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Contract not found: {str(e)}")

@router.get("/health")
async def contract_health():
    """Health check for contract service."""
    return {"status": "ok", "service": "Smart Contract API"}
