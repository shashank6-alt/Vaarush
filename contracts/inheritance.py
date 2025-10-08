from pyteal import *

def inheritance_contract():
    # Global state keys
    owner_key = Bytes("Owner")
    heir_key = Bytes("Heir")
 

    on_creation = Seq([
        App.globalPut(owner_key, Txn.sender()),
        App.globalPut(heir_key, Txn.accounts[1]),
        Return(Int(1))
    ])


    on_inherit = Seq([
        Assert(Txn.sender() == App.globalGet(owner_key)),
  
        Return(Int(1))
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.NoOp, on_inherit],
    )
    return program

if __name__ == "__main__":
    print(compileTeal(inheritance_contract(), Mode.Application, version=5))
