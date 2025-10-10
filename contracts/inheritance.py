# contracts/inheritance.py
from pyteal import *

def inheritance_contract():
    owner_key = Bytes("Owner")
    heir_key = Bytes("Heir")
    asset_key = Bytes("AssetID")
    release_key = Bytes("ReleaseTime")

    on_creation = Seq([
        App.globalPut(owner_key, Txn.sender()),
        App.globalPut(heir_key, Txn.accounts[1]),
        App.globalPut(asset_key, Btoi(Txn.application_args[0])),
        App.globalPut(release_key, Btoi(Txn.application_args[1])),
        Return(Int(1))
    ])

    on_claim = Seq([
        Assert(Txn.sender() == App.globalGet(owner_key)),
        Assert(Global.latest_timestamp() >= App.globalGet(release_key)),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: App.globalGet(asset_key),
            TxnField.asset_receiver: App.globalGet(heir_key),
            TxnField.asset_amount: Int(1)
        }),
        InnerTxnBuilder.Submit(),
        Return(Int(1))
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.NoOp, on_claim]
    )
    return program

if __name__ == "__main__":
    print(compileTeal(inheritance_contract(), Mode.Application, version=5))
