# contracts/test_contract.py

"""
Test script to compile the inheritance contract using PyTeal.
This verifies your contract compiles without errors.
"""

from pyteal import compileTeal, Mode

# Import the contract functions directly from CONTRACT.py in the same folder
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from CONTRACT import approval_program, clear_state_program


def test_compile_contract():
    """Test compiling the inheritance contract."""
    try:
        print("Compiling approval program...")
        approval_teal = compileTeal(
            approval_program(), 
            Mode.Application, 
            version=8
        )
        print("✓ Approval program compiled successfully")
        print(f"  Length: {len(approval_teal)} characters")
        
        print("\nCompiling clear state program...")
        clear_teal = compileTeal(
            clear_state_program(), 
            Mode.Application, 
            version=8
        )
        print("✓ Clear state program compiled successfully")
        print(f"  Length: {len(clear_teal)} characters")
        
        # Save to files
        with open("contracts/approval.teal", "w") as f:
            f.write(approval_teal)
        print("\n✓ Saved to contracts/approval.teal")
        
        with open("contracts/clear.teal", "w") as f:
            f.write(clear_teal)
        print("✓ Saved to contracts/clear.teal")
        
        print("\n" + "=" * 60)
        print("✓ CONTRACT COMPILATION SUCCESSFUL!")
        print("=" * 60)
        print("Your contract is ready to deploy!")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error compiling contract: {e}")
        return False


if __name__ == "__main__":
    success = test_compile_contract()
    sys.exit(0 if success else 1)
