# contracts/deploy_pyteal.py

"""
Deploy PyTeal-based Will Manager Smart Contract to Algorand TestNet
Usage: python contracts/deploy_pyteal.py <creator-mnemonic> <executor-address>
"""

import sys
import base64
from pyteal import compileTeal, Mode, Approve
from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import (
    ApplicationCreateTxn,
    OnComplete,
    StateSchema,
    wait_for_confirmation,
)


# Algorand TestNet configuration
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""


def read_teal_file(filename):
    """Read TEAL file and return contents."""
    with open(filename, 'r') as f:
        return f.read()


def compile_program(client, source_code):
    """Compile TEAL source code to binary."""
    compile_response = client.compile(source_code)
    return base64.b64decode(compile_response['result'])


def compile_contract():
    """Compile the contract to TEAL if not already compiled."""
    import os
    
    # Check if TEAL files exist
    if os.path.exists("contracts/approval.teal") and os.path.exists("contracts/clear.teal"):
        print("✓ TEAL files found")
        return
    
    print("Compiling PyTeal contract...")
    
    # Import and compile from CONTRACT.py
    import sys
    sys.path.insert(0, 'contracts')
    from CONTRACT import approval_program, clear_state_program
    
    # Compile to TEAL
    teal_approval = compileTeal(approval_program(), Mode.Application, version=8)
    teal_clear = compileTeal(clear_state_program(), Mode.Application, version=8)
    
    # Write to files
    with open("contracts/approval.teal", "w") as f:
        f.write(teal_approval)
    with open("contracts/clear.teal", "w") as f:
        f.write(teal_clear)
    
    print("✓ Contract compiled successfully")


def deploy_contract(creator_mnemonic, executor_address):
    """
    Deploy the Will Manager contract.
    
    Args:
        creator_mnemonic: 25-word mnemonic of deploying account
        executor_address: Algorand address of executor
    
    Returns:
        app_id: Application ID of deployed contract
    """
    
    # Initialize Algod client
    algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    # Get creator account
    creator_private_key = mnemonic.to_private_key(creator_mnemonic)
    creator_address = account.address_from_private_key(creator_private_key)
    
    print()
    print("=" * 60)
    print("Deploying WillManager Contract to Algorand TestNet")
    print("=" * 60)
    print(f"Creator Address: {creator_address}")
    print(f"Executor Address: {executor_address}")
    print()
    
    # Compile contract if needed
    compile_contract()
    
    # Read and compile TEAL programs
    print("Loading TEAL programs...")
    approval_source = read_teal_file("contracts/approval.teal")
    clear_source = read_teal_file("contracts/clear.teal")
    
    print("Compiling TEAL to bytecode...")
    approval_program = compile_program(algod_client, approval_source)
    clear_program = compile_program(algod_client, clear_source)
    
    # Define state schema
    global_schema = StateSchema(num_uints=1, num_byte_slices=1)
    local_schema = StateSchema(num_uints=2, num_byte_slices=1)
    
    # Get suggested parameters
    params = algod_client.suggested_params()
    
    # Create application transaction
    print("Creating application transaction...")
    txn = ApplicationCreateTxn(
        sender=creator_address,
        sp=params,
        on_complete=OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=global_schema,
        local_schema=local_schema,
        app_args=[],
    )
    
    # Sign transaction
    signed_txn = txn.sign(creator_private_key)
    
    # Send transaction
    tx_id = algod_client.send_transaction(signed_txn)
    print(f"Transaction sent: {tx_id}")
    print("Waiting for confirmation...")
    
    # Wait for confirmation
    try:
        confirmed_txn = wait_for_confirmation(algod_client, tx_id, 4)
        app_id = confirmed_txn['application-index']
        
        print()
        print("=" * 60)
        print("✓ CONTRACT DEPLOYED SUCCESSFULLY!")
        print("=" * 60)
        print(f"App ID: {app_id}")
        print(f"Transaction ID: {tx_id}")
        print(f"Confirmed in round: {confirmed_txn['confirmed-round']}")
        print(f"Explorer: https://testnet.algoexplorer.io/application/{app_id}")
        print("=" * 60)
        print()
        
        return app_id
        
    except Exception as e:
        print(f"\n❌ Error during deployment: {e}")
        return None


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python contracts/deploy_pyteal.py '<25-word-mnemonic>' <executor-address>")
        print("\nExample:")
        print('  python contracts/deploy_pyteal.py "word1 word2 ... word25" ALGORAND_ADDRESS')
        sys.exit(1)
    
    creator_mnemonic = sys.argv[1]
    executor_address = sys.argv[2]
    
    # Validate inputs
    try:
        mnemonic.to_private_key(creator_mnemonic)
    except Exception as e:
        print(f"❌ Error: Invalid mnemonic - {e}")
        sys.exit(1)
    
    if len(executor_address) != 58:
        print("❌ Error: Invalid Algorand address (must be 58 characters)")
        sys.exit(1)
    
    # Deploy
    app_id = deploy_contract(creator_mnemonic, executor_address)
    
    if app_id:
        print(f"✓ Save this App ID: {app_id}")
        print("You can now interact with your contract!")
