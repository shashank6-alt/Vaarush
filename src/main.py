# src/api/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess

app = FastAPI()

class PlanRequest(BaseModel):
    creator_pk: str
    heir_addr: str
    asset_id: int
    release_time: int

@app.post("/plans")
def create_plan(req: PlanRequest):
    try:
        result = subprocess.check_output([
            "python", "contracts/deploy.py", req.creator_pk
        ] + [str(req.asset_id), str(req.release_time)])
        return {"app_id": int(result.strip())}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=e.output.decode())

