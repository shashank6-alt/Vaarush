# src/utils/config.py

"""
Configuration loader for Algorand node and account credentials.
Loads environment variables from .env via python-dotenv.
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Algorand node settings
    ALGOD_ADDRESS: str = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
    ALGOD_TOKEN: str = os.getenv("ALGOD_TOKEN", "")
    ALGOD_HEADERS: dict = {
        "X-API-Key": ALGOD_TOKEN
    }

    # Creator account mnemonic (for contract deployer)
    CREATOR_MNEMONIC: str = os.getenv("CREATOR_MNEMONIC", "")
    CREATOR_ADDRESS: str = os.getenv("CREATOR_ADDRESS", "")

    # Path to compiled TEAL files (optional)
    TEAL_PATH: str = os.getenv("TEAL_PATH", "build/")

    @classmethod
    def validate(cls):
        missing = []
        if not cls.ALGOD_TOKEN:
            missing.append("ALGOD_TOKEN")
        if not cls.CREATOR_MNEMONIC:
            missing.append("CREATOR_MNEMONIC")
        if not cls.CREATOR_ADDRESS:
            missing.append("CREATOR_ADDRESS")
        if missing:
            raise EnvironmentError(f"Missing required config: {', '.join(missing)}")

# Validate on import
Config.validate()

