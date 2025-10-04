from pyteal import *

def approval_program():
    return Approve()

def clear_program():
    return Approve()

if __name__ == "__main__":
    print(compileTeal(approval_program(), mode=Mode.Application, version=6))
