from pyteal import *

def approval_program():
    return Approve()

def clear_program():
    return Approve()

if __name__ == "__main__":
    print(compileTeal(approval_program(), mode=Mode.Application, version=6))

from algopy import ARC4Contract, arc4

class WillManagerContract(ARC4Contract):
    @arc4.abimethod
    def ping(self) -> arc4.String:
        return arc4.String("pong")