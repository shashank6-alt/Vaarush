import algosdk
from algosdk.atomic_transaction_composer import AtomicTransactionComposer, AccountTransactionSigner
from algosdk import account, mnemonic
from algosdk.v2client import algod

# TestNet connection
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""
client = algosdk.v2client.algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

# Your account details
YOUR_MNEMONIC = "paste your 25-word mnemonic here"
private_key = mnemonic.to_private_key(YOUR_MNEMONIC)
sender = account.address_from_private_key(private_key)

print(f"Deploying from: {sender}")

# TEAL approval program
approval_program = """#pragma version 8
txn ApplicationID
int 0
==
bnz create
err
create:
byte "owner"
txn Sender
app_global_put
byte "asset_id"
txna ApplicationArgs 0
btoi
app_global_put
byte "release_time"
txna ApplicationArgs 1
btoi
app_global_put
int 1
return"""

# TEAL clear program
clear_program = """#pragma version 8
int 1
return"""

# Compile programs
def compile_program(source_code):
    compile_response = client.compile(source_code)
    return bytes.fromhex(compile_response['result'])

approval_compiled = compile_program(approval_program)
clear_compiled = compile_program(clear_program)

# Get suggested params
sp = client.suggested_params()

# Create transaction
txn = algosdk.transaction.ApplicationCreateTxn(
    sender=sender,
    index=0,
    approval_program=approval_compiled,
    clear_program=clear_compiled,
    global_schema=algosdk.transaction.StateSchema(
        num_uints=2,
        num_byte_slices=1
    ),
    local_schema=algosdk.transaction.StateSchema(0, 0),
    app_args=[
        b"create",
        algosdk.encoding.encode_as_bytes(1),  # asset_id
        algosdk.encoding.encode_as_bytes(1735689600)  # unix timestamp
    ],
    sp=sp
)

# Sign and send
signed_txn = txn.sign(private_key)
txid = client.send_transaction(signed_txn)

print(f"Transaction sent! TX ID: {txid}")

# Wait for confirmation
def wait_for_confirmation(client, txid):
    last_round = client.status()["last-round"]
    while True:
        txinfo = client.pending_transaction_info(txid)
        if txinfo.get("confirmed-round", 0) > 0:
            return txinfo
        last_round += 1
        client.status_after_block(last_round)

confirmed_txn = wait_for_confirmation(client, txid)
app_id = confirmed_txn["application-index"]

print(f"\n SUCCESS!")
print(f"App ID: {app_id}")
print(f"View on explorer: https://testnet.algoexplorer.io/application/{app_id}")
