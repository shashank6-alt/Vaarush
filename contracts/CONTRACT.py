# contracts/CONTRACT.py

from pyteal import *


def approval_program():
    """
    Will Manager Smart Contract - Approval Program
    Manages digital inheritance with executor and heir registration
    """
    
    # Global state keys
    executor_key = Bytes("executor")
    total_share_key = Bytes("total_share")
    
    # Local state keys (per heir account)
    heir_share_key = Bytes("heir_share")
    heir_data_key = Bytes("heir_data")
    is_registered_key = Bytes("is_registered")
    
    # Initialize contract
    on_create = Seq([
        App.globalPut(executor_key, Txn.sender()),
        App.globalPut(total_share_key, Int(0)),
        Approve()
    ])
    
    # Register a new heir
    register_heir = Seq([
        Assert(Txn.sender() == App.globalGet(executor_key)),
        App.localPut(Txn.accounts[1], is_registered_key, Int(1)),
        Approve()
    ])
    
    # Set will details for heir
    set_will = Seq([
        Assert(Txn.sender() == App.globalGet(executor_key)),
        Assert(App.localGet(Txn.accounts[1], is_registered_key) == Int(1)),
        Assert(Btoi(Txn.application_args[1]) <= Int(100)),
        App.localPut(Txn.accounts[1], heir_share_key, Btoi(Txn.application_args[1])),
        App.localPut(Txn.accounts[1], heir_data_key, Txn.application_args[2]),
        Approve()
    ])
    
    # Get heir info
    get_heir_info = Seq([
        If(
            App.localGet(Txn.accounts[1], is_registered_key) == Int(1),
            Approve(),
            Reject()
        )
    ])
    
    # Execute will (placeholder)
    execute_will = Seq([
        Assert(Txn.sender() == App.globalGet(executor_key)),
        Approve()
    ])
    
    # Health check
    ping = Approve()
    
    # Router based on application args
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("register_heir"), register_heir],
        [Txn.application_args[0] == Bytes("set_will"), set_will],
        [Txn.application_args[0] == Bytes("get_heir_info"), get_heir_info],
        [Txn.application_args[0] == Bytes("execute_will"), execute_will],
        [Txn.application_args[0] == Bytes("ping"), ping],
    )
    
    return program


def clear_state_program():
    """Clear state program - allows users to clear local state."""
    return Approve()


if __name__ == "__main__":
    # Compile to TEAL
    with open("contracts/approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=8)
        f.write(compiled)
    
    with open("contracts/clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=8)
        f.write(compiled)
    
    print("✓ Contract compiled successfully!")
    print("  - approval.teal")
    print("  - clear.teal")
