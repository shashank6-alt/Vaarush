# src/scripts/test_flow.py

"""
Simulates end-to-end contract lifecycle for testing:
1. Deploy contract
2. Register a second heir
3. Claim asset as heir (after release time override)
4. Fetch and print final contract state
"""

import time
import json
from datetime import datetime, timedelta
from utils.config import Config
from utils.algorand import deploy_contract, register_heir_tx, claim_asset_tx, get_app_state

def run_test():
    # Load and validate config
    Config.validate()
    creator = Config.CREATOR_ADDRESS

    # Set test parameters
    primary_heir = creator  # self-heir for test
    secondary_heir = creator  # use same for simplicity
    asset_id = 123456  # replace with a valid ASA on testnet
    release_time = int((datetime.utcnow() + timedelta(seconds=5)).timestamp())

    print("Deploying contract...")
    app_id, deploy_tx = deploy_contract(
        owner=creator,
        heir=primary_heir,
        asset_id=asset_id,
        release_time=release_time
    )
    print(json.dumps({"app_id": app_id, "deploy_tx": deploy_tx}))

    print("Registering secondary heir...")
    reg_tx = register_heir_tx(app_id=app_id, heir=secondary_heir, sender=creator)
    print(json.dumps({"register_tx": reg_tx}))

    # Wait until after release_time
    wait = max(0, release_time - int(time.time())) + 1
    print(f"Waiting {wait}s for release_time...")
    time.sleep(wait)

    print("Claiming asset...")
    claim_tx = claim_asset_tx(app_id=app_id, heir=secondary_heir)
    print(json.dumps({"claim_tx": claim_tx}))

    print("Fetching final state...")
    state = get_app_state(app_id)
    print(json.dumps({"final_state": state}, indent=2))

if __name__ == "__main__":
    run_test()
