# contracts/deploy_pyteal.py

"""
Deployment script for PyTeal-based Will Manager Smart Contract.
Deploys to Algorand TestNet using py-algorand-sdk.
"""

import sys
import os
from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn, OnComplete, StateSchema
from algosdk.logic import get_application_address
import base64


# Algorand node configuration (TestNet)
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""  # Public node requires no token


def read_teal_file(filename):
    """Read TEAL file and return contents."""
    with open(filename, 'r') as f:
        return f.read()


def compile_program(client, source_code):
    """Compile TEAL source code to binary."""
    compile_response = client.compile(source_code)
    return base64.b64decode(compile_response['result'])


def deploy_contract(creator_mnemonic, executor_address):
    """
    Deploy the Will Manager contract to Algorand.
    
    Args:
        creator_mnemonic: 25-word mnemonic of account deploying contract
        executor_address: Address that will manage the will
    
    Returns:
        app_id: Application ID of deployed contract
    """
    
    # Initialize Algod client
    algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    # Get creator account from mnemonic
    creator_private_key = mnemonic.to_private_key(creator_mnemonic)
    creator_address = account.address_from_private_key(creator_private_key)
    
    print(f"Deploying contract from: {creator_address}")
    print(f"Executor address: {executor_address}")
    
    # Read TEAL files
    approval_program_source = read_teal_file("contracts/approval.teal")
    clear_program_source = read_teal_file("contracts/clear.teal")
    
    # Compile programs
    approval_program = compile_program(algod_client, approval_program_source)
    clear_program = compile_program(algod_client, clear_program_source)
    
    # Define state schema
    global_schema = StateSchema(num_uints=1, num_byte_slices=1)  # total_share, executor
    local_schema = StateSchema(num_uints=2, num_byte_slices=1)   # heir_share, is_registered, heir_data
    
    # Get suggested parameters
    params = algod_client.suggested_params()
    
    # Create application transaction
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
    print(f"Transaction ID: {tx_id}")
    
    # Wait for confirmation
    try:
        confirmed_txn = algod_client.pending_transaction_info(tx_id)
        print("Waiting for confirmation...")
        while not (confirmed_txn.get("confirmed-round")):
            confirmed_txn = algod_client.pending_transaction_info(tx_id)
        
        app_id = confirmed_txn['application-index']
        app_address = get_application_address(app_id)
        
        print("\n" + "="*60)
        print("✓ Contract deployed successfully!")
        print("="*60)
        print(f"App ID: {app_id}")
        print(f"App Address: {app_address}")
        print(f"Transaction ID: {tx_id}")
        print(f"Confirmed in round: {confirmed_txn['confirmed-round']}")
        print("="*60)
        
        return app_id
        
    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python deploy_pyteal.py <creator_mnemonic> <executor_address>")
        print("\nExample:")
        print('  python deploy_pyteal.py "word1 word2 ... word25" EXECUTOR_ALGO_ADDRESS')
        sys.exit(1)
    
    creator_mnemonic = sys.argv[1]
    executor_address = sys.argv[2]
    
    # Validate mnemonic
    try:
        mnemonic.to_private_key(creator_mnemonic)
    except Exception as e:
        print(f"Error: Invalid mnemonic - {e}")
        sys.exit(1)
    
    # Validate executor address
    if len(executor_address) != 58:
        print("Error: Invalid Algorand address (must be 58 characters)")
        sys.exit(1)
    
    # Deploy contract
    app_id = deploy_contract(creator_mnemonic, executor_address)
    
    if app_id:
        print(f"\n✓ Save this App ID: {app_id}")
        print("You'll need it to interact with your contract!")
