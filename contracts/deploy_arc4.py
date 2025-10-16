# contracts/deploy_arc4.py

from algopy import arc4
from algopy import Bytes
from CONTRACT import WillManagerContract

def deploy_arc4(executor_address: str):
    """
    Deploy the ARC4-based WillManagerContract.
    Usage: python deploy_arc4.py <executor_address>
    """
    # executor_address must be a valid Algorand address string
    tx = arc4.arc4_create(
        WillManagerContract,
        executor_addr=Bytes(executor_address.encode())
    )
    print(f"App ID: {tx.created_app}")


