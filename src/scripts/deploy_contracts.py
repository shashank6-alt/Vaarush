# src/scripts/deploy_contracts.py

"""
Deploys the Vaarush inheritance smart contract.
Prints JSON with app_id and txn_id for downstream use.
"""

import os
import json
import argparse
from utils.config import Config
from utils.algorand import deploy_contract

def main(owner, heir, asset_id, release_time):
    # Ensure config is loaded
    Config.validate()

    # Deploy contract
    app_id, txn_id = deploy_contract(
        owner=owner,
        heir=heir,
        asset_id=asset_id,
        release_time=release_time
    )

    result = {
        "app_id": app_id,
        "txn_id": txn_id
    }
    print(json.dumps(result))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Deploy Vaarush inheritance contract")
    parser.add_argument("--owner", required=True, help="Owner Algorand address")
    parser.add_argument("--heir", required=True, help="Heir Algorand address")
    parser.add_argument("--asset-id", type=int, required=True, help="ASA asset ID")
    parser.add_argument("--release-time", type=int, required=True, help="Unix timestamp for release")
    args = parser.parse_args()

    main(
        owner=args.owner,
        heir=args.heir,
        asset_id=args.asset_id,
        release_time=args.release_time
    )
