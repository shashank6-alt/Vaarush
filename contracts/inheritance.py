# contracts/inheritance.py
from pyteal import *

def inheritance_contract():
    owner_key   = Bytes("Owner")
    heir_key    = Bytes("Heir")
    asset_key   = Bytes("AssetID")
    release_key = Bytes("ReleaseTime")
    claimed_key = Bytes("Claimed")

    on_creation = Seq([
        Assert(Txn.application_args.length() == Int(2)),
        App.globalPut(owner_key, Txn.sender()),
        App.globalPut(heir_key, Txn.accounts[1]),                                # Heir address from accounts array
        App.globalPut(asset_key, Btoi(Txn.application_args[0])),                 # Asset ID argument
        Assert(Btoi(Txn.application_args[1]) > Global.latest_timestamp()),       # Release must be in future
        App.globalPut(release_key, Btoi(Txn.application_args[1])),               # Release time argument
        App.globalPut(claimed_key, Int(0)),                                      # Claimed tracker
        Return(Int(1))
    ])

    on_claim = Seq( [
        Assert(App.globalGet(claimed_key) == Int(0)),                            # Only one successful claim allowed
        Assert(Txn.sender() == App.globalGet(heir_key)),                         # Only heir can claim
        Assert(Global.latest_timestamp() >= App.globalGet(release_key)),         # Release time passed
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: App.globalGet(asset_key),
            TxnField.asset_receiver: App.globalGet(heir_key),
            TxnField.asset_amount: Int(1)
       
    })
     ] )
