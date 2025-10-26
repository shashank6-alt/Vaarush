from algosdk.v2client import algod
from algosdk.transaction import ApplicationNoOpTxn
from algosdk import mnemonic, account

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""
APP_ID = 748564269                       # Use your App ID
SENDER_MNEMONIC = "often draw galaxy gadget dragon shuffle segment three prevent beyond negative card swing tip notice negative arm nominee couch amount muscle acoustic spread absorb miss"  # Replace with your real heir/account mnemonic

# Recover private key and address
private_key = mnemonic.to_private_key(SENDER_MNEMONIC)
ACCOUNT = account.address_from_private_key(private_key)

client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
params = client.suggested_params()

app_args = [b"claim"]
txn = ApplicationNoOpTxn(
    sender=ACCOUNT,
    sp=params,
    index=APP_ID,
    app_args=app_args
)

stxn = txn.sign(private_key)
txid = client.send_transaction(stxn)
print("Claim TX sent. TXID:", txid)

import time
for _ in range(30):
    txinfo = client.pending_transaction_info(txid)
    if "confirmed-round" in txinfo:
        print("✅ Claimed! Round:", txinfo["confirmed-round"])
        break
    time.sleep(1)
