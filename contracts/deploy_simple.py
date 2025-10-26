from algosdk.v2client import algod
from algosdk import account, mnemonic
from algosdk.transaction import ApplicationCreateTxn, OnComplete, StateSchema
import base64

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

# YOUR 25-WORD MNEMONIC FROM PERA WALLET (Export Account)
MNEMONIC = "often draw galaxy gadget dragon shuffle segment three prevent beyond negative card swing tip notice negative arm nominee couch amount muscle acoustic spread absorb miss"

# Read TEAL files
with open("contracts/digital_will_approval.teal", "r") as f:
    approval_source = f.read()

with open("contracts/digital_will_clear.teal", "r") as f:
    clear_source = f.read()

# Setup
client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
private_key = mnemonic.to_private_key(MNEMONIC)
sender = account.address_from_private_key(private_key)

print(f"Deploying from: {sender}")

# Compile
def compile_program(source):
    result = client.compile(source)
    return base64.b64decode(result['result'])

approval = compile_program(approval_source)
clear = compile_program(clear_source)

# Create txn
params = client.suggested_params()
txn = ApplicationCreateTxn(
    sender=sender,
    sp=params,
    on_complete=OnComplete.NoOpOC,
    approval_program=approval,
    clear_program=clear,
    global_schema=StateSchema(num_uints=2, num_byte_slices=1),
    local_schema=StateSchema(0, 0),
)

# Sign & send
signed = txn.sign(private_key)
txid = client.send_transaction(signed)

print(f"TX ID: {txid}")

# Wait & confirm
import time
while True:
    info = client.pending_transaction_info(txid)
    if info.get("confirmed-round", 0) > 0:
        app_id = info['application-index']
        print(f"\n SUCCESS!")
        print(f"App ID: {app_id}")
        print(f"Explorer: https://testnet.algoexplorer.io/application/{app_id}")
        break
    time.sleep(1)
