from pyteal import *

def approval_program():
    owner_key = Bytes("owner")
    asset_id_key = Bytes("asset_id")
    release_time_key = Bytes("release_time")
    is_claimed_key = Bytes("is_claimed")
    
    on_create = Seq([
        App.globalPut(owner_key, Txn.sender()),
        App.globalPut(asset_id_key, Btoi(Txn.application_args[1])),
        App.globalPut(release_time_key, Btoi(Txn.application_args[2])),
        App.globalPut(is_claimed_key, Int(0)),
        Return(Int(1))
    ])
    
    can_claim = And(
        Global.latest_timestamp() >= App.globalGet(release_time_key),
        App.globalGet(is_claimed_key) == Int(0)
    )
    
    on_claim = Seq([
        Assert(can_claim),
        App.globalPut(is_claimed_key, Int(1)),
        Return(Int(1))
    ])
    
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("claim"), on_claim]
    )
    
    return program


def clear_state_program():
    return Return(Int(1))


if __name__ == "__main__":
    with open("digital_will_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=8)
        f.write(compiled)
    
    with open("digital_will_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=8)
        f.write(compiled)
    
    print(" Contracts compiled successfully!")
