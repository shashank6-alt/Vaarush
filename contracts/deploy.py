# contracts/deploy.py
import sys
from pyteal import compileTeal, Mode
from algosdk import account, algod, transaction
from contracts.inheritance import inheritance_contract

def compile_contract():
    teal = compileTeal(inheritance_contract(), Mode.Application, version=5)
    with open("inheritance.teal", "w") as f:
        f.write(teal)
    return "inheritance.teal"

def deploy_app(algod_client, creator_private_key, approval_path):
    sender = account.address_from_private_key(creator_private_key)
    with open(approval_path, "rb") as f:
        approval = f.read()
    clear = approval
    params = algod_client.suggested_params()
    txn = transaction.ApplicationCreateTxn(
        sender, params, on_complete=transaction.OnComplete.NoOpOC.real,
        approval_program=approval, clear_program=clear,
        global_schema=transaction.StateSchema(4,1),
        local_schema=transaction.StateSchema(0,0)
    )
    signed = txn.sign(creator_private_key)
    txid = algod_client.send_transaction(signed)
    result = transaction.wait_for_confirmation(algod_client, txid, 4)
    print(result["application-index"])

if __name__ == "__main__":
    client = algod.AlgodClient("<YOUR_TOKEN>", "https://testnet-algorand.api.purestake.io/ps2")
    pk = sys.argv[1]
    teal_file = compile_contract()
    deploy_app(client, pk, teal_file)
