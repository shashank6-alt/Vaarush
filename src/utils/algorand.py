# src/utils/algorand.py

"""
Helper functions for Algorand SDK interactions:
- Compile TEAL
- Deploy smart contract
- Register heir transaction
- Claim asset transaction
- Query application state
"""
from pyteal import Mode, compileTeal
import base64

from algosdk import account, mnemonic
from algosdk.v2client.algod import AlgodClient
from algosdk.future.transaction import (
    ApplicationCreateTxn,
    ApplicationNoOpTxn,
    OnComplete,
    
    AssetTransferTxn,
    PaymentTxn
)

from algosdk.transaction import StateSchema
from algosdk.error import AlgodHTTPError

from utils.config import Config
from contracts.inheritance import inheritance_contract

# Initialize Algod client
algod_client = AlgodClient(
    algod_token=Config.ALGOD_TOKEN,
    algod_address=Config.ALGOD_ADDRESS,
    headers=Config.ALGOD_HEADERS
)


# Recover creator account
CREATOR_PRIVATE_KEY = mnemonic.to_private_key(Config.CREATOR_MNEMONIC)
CREATOR_ADDRESS = Config.CREATOR_ADDRESS

# Correct type hint:
def compile_program(client: AlgodClient, source: str) -> bytes:
    response = client.compile(source)
    return response["result"].encode()

def deploy_contract(owner: str, heir: str, asset_id: int, release_time: int) -> tuple[int, str]:
    """
    Deploy the inheritance smart contract.
    Returns (app_id, transaction_id).
    """
    # Compile approval and clear programs
    approval_teal = compileTeal(inheritance_contract(), mode=Mode.Application, version=5)
    clear_teal = compileTeal(inheritance_contract(), mode=Mode.Application, version=5)  # or a minimal clear state
    approval_bytes = compile_program(algod_client, approval_teal)
    clear_bytes = compile_program(algod_client, clear_teal)

    # Define state schemas
    global_schema = StateSchema(num_uints=4, num_byte_slices=2)  # adjust to your contract
    local_schema = StateSchema(num_uints=0, num_byte_slices=0)

    # Create transaction
    params = algod_client.suggested_params()
    txn = ApplicationCreateTxn(
        sender=CREATOR_ADDRESS,
        on_complete=OnComplete.NoOpOC.real,
        approval_program=approval_bytes,
        clear_program=clear_bytes,
        global_schema=global_schema,
        local_schema=local_schema,
        app_args=[
            owner.encode(),
            heir.encode(),
            asset_id.to_bytes(8, "big"),
            release_time.to_bytes(8, "big"),
        ],
        sp=params
    )

    # Sign and send
    signed_txn = txn.sign(CREATOR_PRIVATE_KEY)
    txid = algod_client.send_transaction(signed_txn)
    # Wait for confirmation
    confirmed = algod_client.pending_transaction_info(txid)
    app_id = confirmed["application-index"]
    return app_id, txid

def register_heir_tx(app_id: int, heir: str, sender: str) -> str:
    """Send a transaction to register/update the heir."""
    params = algod_client.suggested_params()
    txn = ApplicationNoOpTxn(
        sender=sender,
        index=app_id,
        app_args=[b"register_heir", heir.encode()],
        sp=params
    )
    signed = txn.sign(mnemonic.to_private_key(Config.CREATOR_MNEMONIC) if sender == CREATOR_ADDRESS else mnemonic.to_private_key(Config.CREATOR_MNEMONIC))
    txid = algod_client.send_transaction(signed)
    algod_client.pending_transaction_info(txid)
    return txid

def claim_asset_tx(app_id: int, heir: str) -> str:
    """Send a transaction to claim the asset by the heir."""
    params = algod_client.suggested_params()
    txn = ApplicationNoOpTxn(
        sender=heir,
        index=app_id,
        app_args=[b"claim"],
        sp=params
    )
    signed = txn.sign(mnemonic.to_private_key(mnemonic))  # heir mnemonic must be provided or stored
    txid = algod_client.send_transaction(signed)
    algod_client.pending_transaction_info(txid)
    return txid

def get_app_state(app_id: int) -> dict:
    """
    Query the global state of the application.
    Returns dict with keys: owner, heir, asset_id, release_time, claimed.
    """
    try:
        result = algod_client.application_info(app_id)
        state = result["params"]["global-state"]
        parsed = {}
        for item in state:
            key = item["key"]
            value = item["value"]
            decoded_key = base64.b64decode(key).decode()
            if value["type"] == 1:
                parsed[decoded_key] = base64.b64decode(value["bytes"]).decode()
            else:
                parsed[decoded_key] = value["uint"]
        return {
            "owner": parsed.get("owner"),
            "heir": parsed.get("heir"),
            "asset_id": parsed.get("asset_id"),
            "release_time": parsed.get("release_time"),
            "claimed": bool(parsed.get("claimed"))
        }
    except AlgodHTTPError as e:
        raise RuntimeError(f"Failed to fetch state for app {app_id}: {e}")
