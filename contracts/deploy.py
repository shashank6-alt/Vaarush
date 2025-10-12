# contracts/deploy.py
import os
import sys
import base64
from pyteal import compileTeal, Mode, Approve
from algosdk import account
from algosdk.v2client import algod
from algosdk.transaction import (
    ApplicationCreateTxn,
    OnComplete,
    StateSchema,
    wait_for_confirmation,
)
from contracts.inheritance import inheritance_contract


def compile_contract():
    teal = compileTeal(inheritance_contract(), Mode.Application, version=5)
    with open("inheritance.teal", "w") as f:
        f.write(teal)
    return "inheritance.teal"


def deploy_app(algod_client, creator_private_key, approval_path):
    sender = account.address_from_private_key(creator_private_key)

    # Read the TEAL source and compile it via the algod client (returns base64)
    with open(approval_path, "r") as f:
        approval_teal = f.read()

    compiled_approval = algod_client.compile(approval_teal)
    approval_program = base64.b64decode(compiled_approval["result"])

    # Use a minimal clear program (Approve) compiled via algod
    clear_teal = compileTeal(Approve(), Mode.Application, version=5)
    compiled_clear = algod_client.compile(clear_teal)
    clear_program = base64.b64decode(compiled_clear["result"])

    params = algod_client.suggested_params()
    txn = ApplicationCreateTxn(
        sender=sender,
        sp=params,
        on_complete=OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=StateSchema(num_uints=4, num_byte_slices=1),
        local_schema=StateSchema(num_uints=0, num_byte_slices=0),
    )

    signed = txn.sign(creator_private_key)
    txid = algod_client.send_transaction(signed)
    result = wait_for_confirmation(algod_client, txid, 4)
    app_id = result.get("application-index")
    print(app_id)


if __name__ == "__main__":
    # Read Algod token and address from environment so headers (e.g. PureStake) can be provided.
    algod_token = os.environ.get("ALGOD_TOKEN", "<YOUR_TOKEN>")
    algod_address = os.environ.get("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
    # If using a service like PureStake, set headers: {"X-API-Key": ALGOD_TOKEN}
    headers = {"X-API-Key": algod_token} if algod_token and algod_token != "<YOUR_TOKEN>" else None
    try:
        client = algod.AlgodClient(algod_token, algod_address, headers=headers) if headers else algod.AlgodClient(algod_token, algod_address)
    except Exception as e:
        print("Failed to create Algod client:", e)
        sys.exit(1)

    if len(sys.argv) < 2:
        print("Usage: python deploy.py <creator_private_key>\nSet ALGOD_TOKEN and ALGOD_ADDRESS environment variables for your node or service (e.g. PureStake).\nAlso ensure required packages are installed: pip install pyteal py-algorand-sdk")
        sys.exit(1)

    pk = sys.argv[1]
    teal_file = compile_contract()
    try:
        deploy_app(client, pk, teal_file)
    except Exception as e:
        print("Deployment failed:", e)
        raise
