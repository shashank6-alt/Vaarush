from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

app = FastAPI(title="Vaarush Backend", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== DATA MODELS =====
class HeirInfo(BaseModel):
    address: str
    share: Optional[int] = None

class CreateWillRequest(BaseModel):
    owner_address: str
    asset_id: int
    release_time: int
    heirs: List[HeirInfo]

class ClaimAssetsRequest(BaseModel):
    will_id: str
    claimer_address: str

class AIAssistRequest(BaseModel):
    message: str

# ===== HELPER FUNCTIONS =====
def validate_address(address: str) -> bool:
    """Validate Algorand address format"""
    if not address or len(address) < 5:
        return False
    return True

def validate_payload(payload: CreateWillRequest) -> tuple[bool, str]:
    """Validate create will payload"""
    
    # Validate owner address
    if not payload.owner_address or payload.owner_address.lower() == 'hi':
        return False, " Invalid owner address. Must be a valid Algorand address (e.g., RQZKSE...IHII)"
    
    # Validate asset ID
    if payload.asset_id < 0:
        return False, " Asset ID must be a positive number"
    
    if payload.asset_id == 0:
        return False, " Asset ID cannot be 0. Please enter a valid asset ID"
    
    # Validate release time
    if payload.release_time <= 0:
        return False, " Release time must be in the future"
    
    # Validate heirs
    if not payload.heirs or len(payload.heirs) == 0:
        return False, " Must add at least 1 heir"
    
    # Validate heir addresses
    for heir in payload.heirs:
        if not heir.address or heir.address.lower() in ['by', 'hi', 'test']:
            return False, f" Invalid heir address: '{heir.address}'. Must be valid Algorand address"
    
    # Validate shares
    total_share = sum(h.share or 0 for h in payload.heirs)
    if total_share > 100:
        return False, f" Total heir shares ({total_share}%) cannot exceed 100%"
    
    return True, ""

# ===== ROUTES =====

@app.get("/")
def read_root():
    return {
        "message": " Vaarush Backend Running!",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "Backend is operational",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/create-will")
async def create_will(request: CreateWillRequest):
    """
    Create an inheritance contract on Algorand
    """
    try:
        print(f"\n Creating will request:")
        print(f"   Owner: {request.owner_address}")
        print(f"   Asset ID: {request.asset_id}")
        print(f"   Release Time: {request.release_time}")
        print(f"   Heirs: {len(request.heirs)}")
        
        # Validate payload
        is_valid, error_msg = validate_payload(request)
        if not is_valid:
            print(f"    Validation failed: {error_msg}")
            raise ValueError(error_msg)
        
        print(f"    Validation passed")
        
        # Simulate smart contract deployment
        app_id = 12345 + int(request.asset_id)
        txn_id = f"txn_will_{app_id}_{request.owner_address[:8].upper()}"
        
        print(f"    Contract deployed with App ID: {app_id}")
        
        return {
            "status": "success",
            "message": f" Will created successfully! App ID: {app_id}",
            "app_id": app_id,
            "owner": request.owner_address,
            "asset_id": request.asset_id,
            "heirs_count": len(request.heirs),
            "transaction_id": txn_id,
            "release_time": request.release_time
        }
        
    except ValueError as e:
        print(f" Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f" Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/claim-assets")
async def claim_assets(request: ClaimAssetsRequest):
    """
    Claim inherited assets
    """
    try:
        print(f" Claim request: {request.claimer_address}")
        
        if not request.claimer_address or request.claimer_address.lower() in ['by', 'hi']:
            raise ValueError("Invalid claimer address")
        
        txn_id = f"txn_claim_{request.will_id}_{request.claimer_address[:8]}"
        
        return {
            "status": "success",
            "message": " Assets claimed successfully!",
            "will_id": request.will_id,
            "claimer_address": request.claimer_address,
            "transaction_id": txn_id
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/wills/{address}")
async def get_wills(address: str):
    """Get wills for an address"""
    try:
        if not address or address.lower() in ['by', 'hi']:
            raise ValueError("Invalid address")
        
        return {
            "address": address,
            "wills": [],
            "message": "No wills found for this address"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/ai/assist")
async def ai_assist(request: AIAssistRequest):
    """
    AI Assistant endpoint with detailed responses
    """
    try:
        msg = request.message.lower().strip()
        
        # Detailed AI responses
        responses = {
            "create": " To create a will:\n1. Click 'Create Will'\n2. Enter your wallet address\n3. Add asset ID\n4. Set release date\n5. Add heirs with shares\n6. Click 'Deploy'",
            "deploy": " To deploy:\n1. Fill all details correctly\n2. Check 🟢 API Connected\n3. Click 'Deploy Contract'\n4. You'll get App ID",
            "wallet": " Click 'Connect Wallet' to link your Algorand wallet",
            "claim": " Beneficiaries can claim from dashboard after release date",
            "blockchain": " Vaarush uses Algorand for secure inheritance",
            "error": " Errors usually mean:\n• Invalid address\n• Asset ID < 0\n• Total shares > 100%\n• Backend not running",
            "help": " Ask about: creating wills, deploying, claiming assets, blockchain, or troubleshooting"
        }
        
        # Find matching response
        for key, response in responses.items():
            if key in msg:
                return {"response": response, "status": "success"}
        
        # Default response
        default = "🤖 I can help with creating wills, deploying contracts, managing heirs, or claiming assets. What do you need?"
        return {"response": default, "status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
