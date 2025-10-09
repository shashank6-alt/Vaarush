import sys
from pyteal import compileTeal, Mode
from algosdk import account, algod, transaction
from contracts.inheritance import inheritance_contract

def compile_contract():
    teal = compileTeal(inheritance_contract(), Mode.Application, version=5)
    with open("inheritance.teal", "w") as f:
        f.write(teal)
    return "inheritance.teal"

def deploy_app(algod_client, creator_private_key, approval_path, clear_path):
    sender = account.address_from_private_key(creator_private_key)
    with open(approval_path, "rb") as f:
        approval = f.read()
    with open(clear_path, "rb") as f:
        clear = f.read()
    params = algod_client.suggested_params()
    txn = transaction.ApplicationCreateTxn(
        sender, params, on_complete=transaction.OnComplete.NoOpOC.real,
        approval_program=approval, clear_program=clear,
        global_schema=transaction.StateSchema(4,1),
        local_schema=transaction.StateSchema(0,0),
        foreign_apps=[], foreign_assets=[]
    )
    signed = txn.sign(creator_private_key)
    txid = algod_client.send_transaction(signed)
    print("Deploy TXID:", txid)
    result = transaction.wait_for_confirmation(algod_client, txid, 4)
    app_id = result["application-index"]
    print("Deployed App ID:", app_id)

if __name__ == "__main__":
    algod_address = "https://testnet-algorand.api.purestake.io/ps2"
    algod_token = "<YOUR_TOKEN>"
    client = algod.AlgodClient(algod_token, algod_address)
    pk = sys.argv[1]
    teal_file = compile_contract()
    deploy_app(client, pk, teal_file, teal_file)
