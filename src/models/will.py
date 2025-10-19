# src/models/will.py

"""
Pydantic data models for Vaarush inheritance API.
Defines request and response schemas for creating plans, registering heirs, and querying status.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, validator
from datetime import datetime

class Heir(BaseModel):
    """Schema for an heir in a will."""
    address: str = Field(..., description="Algorand address of the heir")
    share: Optional[int] = Field(
        None,
        description="Optional share percentage or portion for the heir"
    )

    @validator("address")
    def address_must_be_algorand(cls, v: str) -> str:
        if not (v.startswith("A") and len(v) in (58, 59)):
            raise ValueError("Invalid Algorand address format")
        return v

class WillCreateRequest(BaseModel):
    """Request to deploy a new inheritance contract."""
    owner_address: str
